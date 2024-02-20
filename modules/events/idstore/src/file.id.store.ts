import { NameAnd } from "@laoban/utils";
import { promises } from "fs";
import { IdStore, IdStoreResult } from "./id.store";

export interface IdStoreDetails {
  extension: string
  rootPath: string
  mimeType: string
}

/** WIth an id like ks:first:part:file ... then ks points to the IdStoreDetails. The rest is the path to the file and we had an extension to it */
export type AllIdStoreDetails = NameAnd<IdStoreDetails>

export type PathAndMimeType = {
  path: string
  mimeType: string

}
export function idPathToFilePathAndMimeType ( details: AllIdStoreDetails, s: string ): PathAndMimeType {
  const index = s.indexOf ( ':' )
  if ( index === -1 ) throw Error ( `Invalid id no ':' in ${s}]` )
  const key = s.slice ( 0, index )
  const path = s.slice ( index + 1 ).replace ( /:/g, '/' )
  const d = details[ key ]
  if ( !d ) throw Error ( `No details for ${key}. Legal values are ${Object.keys ( details )}` )
  return { path: `${d.rootPath}/${path}.${d.extension}`, mimeType: d.mimeType }
}

export function defaultIdStoreDetails ( root: string ): AllIdStoreDetails {
  return {
    ka: { extension: 'md', rootPath: `${root}/kas`, mimeType: 'text/markdown; charset=UTF-8' },
    sc: { extension: 'md', rootPath: `${root}/scs`, mimeType: 'text/markdown; charset=UTF-8' },
    ticket: { extension: 'events.txt', rootPath: `${root}/tickets`, mimeType: 'text/plain; charset=UTF-8' }
  }
}
export const loadFromIdStore = ( details: AllIdStoreDetails ): IdStore =>
  async ( id: string ): Promise<IdStoreResult> => {
    try {
      const { path, mimeType } = idPathToFilePathAndMimeType ( details, id )
      let buffer = await promises.readFile ( path );
      return { id, mimeType, result: buffer.toString ( 'utf-8' ) }
    } catch ( e ) {
      return { id, error: e.message }
    }
  };
