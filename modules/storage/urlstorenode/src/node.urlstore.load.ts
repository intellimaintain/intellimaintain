import { ErrorsAnd, hasErrors, mapErrors, mapErrorsK } from "@laoban/utils";
import { IdentityUrl, isIdentityUrl, isNamedUrl, NamedOrIdentityUrl, NamedUrl, parseIdentityUrl, parseUrl, UrlLoadFn, UrlLoadResult } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";
import { namedUrlToPath, OrgAndNameSpaceDetails, OrganisationToNameSpaceToDetails, PathAndDetails, urlToOrgAndNamdDetails } from "./node.urlstore";


export const loadFromNamedUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ) => ( named: NamedUrl ): Promise<ErrorsAnd<UrlLoadResult>> => {
  return mapErrorsK ( namedUrlToPath ( config ) ( named ), async ( { path, details, orgDetails } ) => {
    let stats = await fs.promises.stat ( path )
    const fileSize = stats.size
    let buffer = await fs.promises.readFile ( path );
    const string = buffer.toString ( details.encoding )
    const result = details.parser ( named.url, string )
    const hash = await gitOps.hashFor ( config.baseDir + '/' + orgDetails.gitRepoPath, path )
    const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
    return { url: named.url, mimeType: details.mimeType, result, id, fileSize }
  } )
}

export const loadFromIdentityUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ) => async ( identity: IdentityUrl ): Promise<ErrorsAnd<UrlLoadResult>> => {
  if ( !isIdentityUrl ( identity ) ) return [ `${JSON.stringify ( identity )} is not a IdentityUrl` ]
  return mapErrorsK ( urlToOrgAndNamdDetails ( config, identity ), async ( { orgDetails, details } ) => {
    let repo = config.baseDir + '/' + orgDetails.gitRepoPath;
    const fileSize = await gitOps.sizeForHash ( repo, identity.id )
    const string = await gitOps.fileFor ( repo, identity.id )
    const result = details.parser ( identity.url, string )
    return { url: identity.url, mimeType: details.mimeType, result, fileSize, id: identity.url }
  } )
}

export const loadFromUrlStore = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ): UrlLoadFn => async ( url: string ): Promise<ErrorsAnd<UrlLoadResult>> => {
  const namedOrIdentity = parseUrl ( url )
  if ( hasErrors ( namedOrIdentity ) ) return namedOrIdentity
  if ( isNamedUrl ( namedOrIdentity ) ) return loadFromNamedUrl ( gitOps, config ) ( namedOrIdentity )
  if ( isIdentityUrl ( namedOrIdentity ) ) return loadFromIdentityUrl ( gitOps, config ) ( namedOrIdentity )
  return [ `${url} is not a valid url` ]
}