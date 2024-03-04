import { ErrorsAnd, mapErrorsK } from "@laoban/utils";
import { isNamedUrl, parseUrl, UrlSaveFn, UrlStoreResult } from "@intellimaintain/url";
import * as fs from "fs";
import { GitOps } from "@intellimaintain/git";
import { namedUrlToPath, OrganisationToNameSpaceToDetails } from "./node.urlstore";



export const saveNamedUrl = ( gitOps: GitOps, config: OrganisationToNameSpaceToDetails ): UrlSaveFn =>
  ( s: string, content: any ): Promise<ErrorsAnd<UrlStoreResult>> => {
    return mapErrorsK ( parseUrl ( s ), async ( named ) => {
      if ( !isNamedUrl ( named ) ) return [ `${JSON.stringify ( named )} is not a NamedUrl` ]
      return mapErrorsK ( namedUrlToPath ( config ) ( named ), ( { path, details, orgDetails } ) => {
        return mapErrorsK ( details.writer ( content ), async string => {
          try {
            await fs.promises.writeFile ( path, string, { encoding: details.encoding } )
            const gitRepo = config.baseDir + '/' + orgDetails.gitRepoPath;
            const hash = await gitOps.hashFor ( gitRepo, path )
            const id = `itsmid:${named.organisation}:${named.namespace}:${hash}`
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