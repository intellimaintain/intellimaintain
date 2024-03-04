import { ErrorsAnd, mapErrors, mapErrorsK, NameAnd } from "@laoban/utils";
import { IdentityUrl, isIdentityUrl, isNamedUrl, NamedOrIdentityUrl, NamedUrl, UrlStoreResult } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";

export type UrlStoreParser = ( id: string, s: string ) => any
export interface NameSpaceDetails {
  pathInGitRepo: string
  extension: string
  mimeType: string
  parser: UrlStoreParser
  encoding: BufferEncoding
}
export function nameSpaceDetails ( name: string, partial: Partial<NameSpaceDetails> & Required<Pick<NameSpaceDetails, 'parser'>> ): NameSpaceDetails {
  return {
    pathInGitRepo: partial.pathInGitRepo || name,
    extension: partial.extension || 'yaml',
    mimeType: partial.mimeType || 'text/yaml',
    parser: partial.parser,
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

export const loadFromNamedUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ) => ( named: NamedUrl ): Promise<ErrorsAnd<UrlStoreResult>> => {
  return mapErrorsK ( namedUrlToPath ( config ) ( named ), async ( { path, details, orgDetails } ) => {
    let stats = await fs.promises.stat ( path )
    const count = stats.size
    let buffer = await fs.promises.readFile ( path );
    const string = buffer.toString ( details.encoding )
    const result = details.parser ( named.url, string )
    const hash = await gitOps.hashFor ( config.baseDir + '/' + orgDetails.gitRepoPath, path )
    const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
    return { url: named.url, mimeType: details.mimeType, result, id, count }
  } )
}

export const loadFromIdentityUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ) => async ( identity: IdentityUrl ): Promise<ErrorsAnd<UrlStoreResult>> => {
  if ( !isIdentityUrl ( identity ) ) return [ `${JSON.stringify ( identity )} is not a IdentityUrl` ]
  return mapErrorsK ( urlToOrgAndNamdDetails ( config, identity ), async ( { orgDetails, details } ) => {
    let repo = config.baseDir + '/'+ orgDetails.gitRepoPath;
    const count = await gitOps.sizeForHash ( repo, identity.id )
    const string = await gitOps.fileFor ( repo, identity.id )
    const result = details.parser ( identity.url, string )
    return { url: identity.url, mimeType: details.mimeType, result, count, id: identity.url }
  } )
}
