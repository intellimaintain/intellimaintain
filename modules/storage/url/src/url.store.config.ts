import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { isNamedUrl, NamedOrIdentityUrl, NamedUrl, parseUrl } from "./identity.and.name.url";


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

export type AllNamespaceDetails = NameAnd<NameSpaceDetails>

export type OrganisationUrlStoreConfig = {
  baseDir: string
  nameSpaceDetails: AllNamespaceDetails
}

export type PathAndDetails = {path: string, details: NameSpaceDetails }
export function repoFrom ( config: OrganisationUrlStoreConfig, url: NamedOrIdentityUrl ): string {
  return config.baseDir + '/' + url.organisation;
}
export function urlToDetails ( config: OrganisationUrlStoreConfig, url: NamedOrIdentityUrl ): ErrorsAnd<NameSpaceDetails> {
  const nsLookup = config.nameSpaceDetails
  const details = nsLookup[ url.namespace ];
  if ( !details ) return [ `Don't know how to handle namespace ${url.namespace}. Legal namespaces are ${Object.keys ( nsLookup )}` ];
  return details
}
export const namedUrlToPathAndDetails = ( config: OrganisationUrlStoreConfig ) => ( named: NamedUrl ): ErrorsAnd<PathAndDetails> => {
  if ( !isNamedUrl ( named ) ) return [ `${JSON.stringify ( named )} is not a NamedUrl` ]
  const nsLookup = config.nameSpaceDetails
  const details = nsLookup[ named.namespace ];
  if ( !details ) return [ `Don't know how to handle namespace ${named.namespace}. Legal namespaces are ${Object.keys ( nsLookup )}` ];
  const path = `${config.baseDir}/${named.organisation}/${details.pathInGitRepo}/${named.name}.${details.extension}`;
  return { path, details }
}