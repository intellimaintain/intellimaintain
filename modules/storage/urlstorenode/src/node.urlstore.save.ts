import { ErrorsAnd, mapErrorsK } from "@laoban/utils";
import { isNamedUrl, namedUrlToPath, OrganisationToNameSpaceToDetails, parseUrl, UrlSaveFn, UrlStoreResult } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";
import path from "path";


export const saveNamedUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ): UrlSaveFn =>
  ( s: string, content: any ): Promise<ErrorsAnd<UrlStoreResult>> => {
    return mapErrorsK ( parseUrl ( s ), async ( named ) => {
      if ( !isNamedUrl ( named ) ) return [ `${JSON.stringify ( named )} is not a NamedUrl` ]
      return mapErrorsK ( namedUrlToPath ( config ) ( named ), ( { path: thePath, details, orgDetails } ) => {
        return mapErrorsK ( details.writer ( content ), async string => {
          try {
            await fs.promises.mkdir ( path.dirname ( thePath ), { recursive: true } )
            await fs.promises.writeFile ( thePath, string, { encoding: details.encoding } )
            const gitRepo = config.baseDir + '/' + orgDetails.gitRepoPath;
            const hash = await gitOps.hashFor ( gitRepo, thePath )
            const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
            await gitOps.init ( gitRepo ) // creates a new repo if needed including the directory.
            await gitOps.commit ( gitRepo, `Saving ${named.name} as ${id}` )
            const fileSize = await gitOps.sizeForHash ( gitRepo, hash )
            const result: UrlStoreResult = { url: named.url, fileSize, id };
            return result
          } catch ( e ) {
            return [ `Failed to save ${s}\n${content}`, e ]
          }
        } )
      } )
    } )
  }