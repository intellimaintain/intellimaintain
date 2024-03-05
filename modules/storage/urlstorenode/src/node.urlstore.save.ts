import { ErrorsAnd, mapErrorsK } from "@laoban/utils";
import { isNamedUrl, namedUrlToPathAndDetails, OrganisationUrlStoreConfig, parseUrl, repoFrom, UrlSaveFn, UrlStoreResult } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";
import path from "path";


export const saveNamedUrl = ( gitOps: GitOps, config: OrganisationUrlStoreConfig ): UrlSaveFn =>
  ( s: string, content: any ): Promise<ErrorsAnd<UrlStoreResult>> => {
    return mapErrorsK ( parseUrl ( s ), async ( named ) => {
      if ( !isNamedUrl ( named ) ) return [ `${JSON.stringify ( named )} is not a NamedUrl` ]
      return mapErrorsK ( namedUrlToPathAndDetails ( config ) ( named ), ( { path: thePath, details } ) => {
        return mapErrorsK ( details.writer ( content ), async string => {
          try {
            await fs.promises.mkdir ( path.dirname ( thePath ), { recursive: true } )
            await fs.promises.writeFile ( thePath, string, { encoding: details.encoding } )
            const repo = repoFrom ( config, named )
            const hash = await gitOps.hashFor ( repo, thePath )
            const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
            await gitOps.init ( repo ) // creates a new repo if needed including the directory.
            await gitOps.commit ( repo, `Saving ${named.name} as ${id}` )
            const fileSize = await gitOps.sizeForHash ( repo, hash )
            const result: UrlStoreResult = { url: named.url, fileSize, id };
            return result
          } catch ( e ) {
            return [ `Failed to save ${s}\n${content}`, e ]
          }
        } )
      } )
    } )
  }