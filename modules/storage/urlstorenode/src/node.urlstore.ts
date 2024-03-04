import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { isNamedUrl, NamedOrIdentityUrl, NamedUrl } from "@intellimaintain/url";

export type UrlStoreParser = ( id: string, s: string ) => any
export type UrlStoreWriter = ( content: any ) => ErrorsAnd<string>
export interface NameSpaceDetails {
  pathInGitRepo: string
  extension: string
  mimeType: string
  parser: UrlStoreParser
  writer: UrlStoreWriter
  encoding: BufferEncoding
}
export function nameSpaceDetails ( name: string, partial: Partial<NameSpaceDetails> & Required<Pick<NameSpaceDetails, 'parser' | 'writer'>> ): NameSpaceDetails {
  return {
    pathInGitRepo: partial.pathInGitRepo || name,
    extension: partial.extension || 'yaml',
    mimeType: partial.mimeType || 'text/yaml',
    parser: partial.parser,
    writer: partial.writer,
    encoding: partial.encoding || 'utf8'
  }
}

export interface OrganisationStoreDetails {
  gitRepoPath: string
  nameSpaceToDetails: NameAnd<NameSpaceDetails>
}
export type OrganisationToNameSpaceToDetails = {
  baseDir: string
  orgToDetails: NameAnd<OrganisationStoreDetails>
}
export type OrgAndNameSpaceDetails = {
  orgDetails: OrganisationStoreDetails
  details: NameSpaceDetails
}
export type PathAndDetails = OrgAndNameSpaceDetails & { path: string }

export function urlToOrgAndNamdDetails ( config: OrganisationToNameSpaceToDetails, url: NamedOrIdentityUrl ): ErrorsAnd<OrgAndNameSpaceDetails> {
  const orgDetails = config.orgToDetails[ url.organisation ];
  if ( !orgDetails ) return [ `Don't know how to handle organisation ${url.organisation}. Legal organisations are ${Object.keys ( config.orgToDetails )}` ];

  const details = orgDetails.nameSpaceToDetails[ url.namespace ];
  if ( !details ) return [ `Don't know how to handle namespace ${url.namespace}. Legal namespaces are ${Object.keys ( orgDetails.nameSpaceToDetails )}` ];
  return { orgDetails, details };
}
export const namedUrlToPath = ( config: OrganisationToNameSpaceToDetails ) => ( named: NamedUrl ): ErrorsAnd<PathAndDetails> => {
  if ( !isNamedUrl ( named ) ) return [ `${JSON.stringify ( named )} is not a NamedUrl` ]
  return mapErrors ( urlToOrgAndNamdDetails ( config, named ), ( { orgDetails, details } ) => {
    const path = `${config.baseDir}/${orgDetails.gitRepoPath}/${named.namespace}/${named.name}.${details.extension}`;
    return { path, orgDetails, details };
  } )
}