import { ErrorsAnd, hasErrors, mapErrorsK } from "@laoban/utils";
import { IdentityUrl, isIdentityUrl, isNamedUrl, NamedUrl, namedUrlToPathAndDetails, OrganisationUrlStoreConfig, parseUrl, repoFrom, UrlLoadFn, UrlLoadResult, urlToDetails } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";


export const loadFromNamedUrl = ( gitOps: GitOps, config: OrganisationUrlStoreConfig ) => ( named: NamedUrl ): Promise<ErrorsAnd<UrlLoadResult>> => {
  return mapErrorsK ( namedUrlToPathAndDetails ( config ) ( named ), async ( { path, details } ) => {
    console.log('loadFromNamedUrl path', path)
    let stats = await fs.promises.stat ( path )
    const fileSize = stats.size
    let buffer = await fs.promises.readFile ( path );
    const string = buffer.toString ( details.encoding )
    const result = details.parser ( named.url, string )
    const repo = repoFrom ( config, named )
    const hash = await gitOps.hashFor ( repo, path )
    const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
    return { url: named.url, mimeType: details.mimeType, result, id, fileSize }
  } )
}

export const loadFromIdentityUrl = ( gitOps: GitOps, config: OrganisationUrlStoreConfig ) => async ( identity: IdentityUrl ): Promise<ErrorsAnd<UrlLoadResult>> => {
  if ( !isIdentityUrl ( identity ) ) return [ `${JSON.stringify ( identity )} is not a IdentityUrl` ]
  return mapErrorsK ( urlToDetails ( config, identity ), async ( details ) => {
    const repo = repoFrom ( config, identity )
    const fileSize = await gitOps.sizeForHash ( repo, identity.id )
    const string = await gitOps.fileFor ( repo, identity.id )
    const result = details.parser ( identity.url, string )
    return { url: identity.url, mimeType: details.mimeType, result, fileSize, id: identity.url }
  } )
}

export const loadFromUrlStore = ( gitOps: GitOps, config: OrganisationUrlStoreConfig ): UrlLoadFn => async ( url: string ): Promise<ErrorsAnd<UrlLoadResult>> => {
  const namedOrIdentity = parseUrl ( url )
  if ( hasErrors ( namedOrIdentity ) ) return namedOrIdentity
  if ( isNamedUrl ( namedOrIdentity ) ) return loadFromNamedUrl ( gitOps, config ) ( namedOrIdentity )
  if ( isIdentityUrl ( namedOrIdentity ) ) return loadFromIdentityUrl ( gitOps, config ) ( namedOrIdentity )
  return [ `${url} is not a valid url` ]
}