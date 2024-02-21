import { NameAnd } from "@laoban/utils";
import { promises } from "fs";
import { IdStore, IdStoreResult } from "./id.store";
import { ParserStore, parseUsingStore } from "@intellimaintain/parser";

export interface IdStoreDetails {
  extension: string
  rootPath: string
  mimeType: string
}


/** WIth an id like ks:first:part:file ... then ks points to the IdStoreDetails. The rest is the path to the file and we had an extension to it */
export interface AllIdStoreDetails {
  details: NameAnd<IdStoreDetails>
  parserStore: ParserStore
}


export type PathAndMimeType = {
  key: string
  path: string
  mimeType: string

}
export type KeyAndPath = {
  key: string
  path: string
}
export function findIdKeyAndPath ( s: string ):KeyAndPath {
  const index = s.indexOf ( ':' )
  if ( index === -1 ) throw Error ( `Invalid id no ':' in ${s}]` )
  const key = s.slice ( 0, index )
  const path = s.slice ( index + 1 ).replace ( /:/g, '/' )
  return { key, path };
}
export function idPathToFilePathAndMimeType ( details: NameAnd<IdStoreDetails>, s: string ): PathAndMimeType {
  const { key, path } = findIdKeyAndPath ( s );
  const d = details[ key ]
  if ( !d ) throw Error ( `No details for ${key}. Legal values are ${Object.keys ( details )}` )

  return { key, path: `${d.rootPath}/${path}.${d.extension}`, mimeType: d.mimeType }
}

export function defaultIdStoreDetails ( root: string, parserStore: ParserStore ): AllIdStoreDetails {
  return {
    parserStore, details: {
      ka: { extension: 'md', rootPath: `${root}/kas`, mimeType: 'text/markdown; charset=UTF-8' },
      sc: { extension: 'md', rootPath: `${root}/scs`, mimeType: 'text/markdown; charset=UTF-8' },
      ticket: { extension: 'events.txt', rootPath: `${root}/tickets`, mimeType: 'text/plain; charset=UTF-8' }
    }
  }
}
export const loadFromIdStore = ( details: AllIdStoreDetails ): IdStore =>
  async ( id: string, parser: string ): Promise<IdStoreResult> => {
    try {
      const { path, mimeType } = idPathToFilePathAndMimeType ( details.details, id )
      let buffer = await promises.readFile ( path );
      const parserResult = parseUsingStore ( details.parserStore, id, buffer.toString ( 'utf-8' ), parser )
      if ( parserResult.error ) return { id, error: parserResult.error }
      return { id, mimeType, result: parserResult.result }
    } catch ( e ) {
      return { id, error: e.message }
    }
  };
