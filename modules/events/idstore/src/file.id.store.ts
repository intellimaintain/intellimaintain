import { NameAnd } from "@laoban/utils";
import { promises } from "fs";
import { findIdKeyAndPath, IdStore, IdStoreResult } from "./id.store";
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

export function idPathToFilePathAndMimeType ( details: NameAnd<IdStoreDetails>, s: string ): PathAndMimeType {
  const { key, path } = findIdKeyAndPath ( s );
  const d = details[ key ]
  if ( !d ) throw Error ( `No details for ${key}. Legal values are ${Object.keys ( details )}` )

  return { key, path: `${d.rootPath}/${path}.${d.extension}`, mimeType: d.mimeType }
}


export const loadFromIdStore = ( details: AllIdStoreDetails ): IdStore =>
  async ( id: string, parser: string ): Promise<IdStoreResult> => {
    try {
      const { path, mimeType } = idPathToFilePathAndMimeType ( details.details, id )
      let buffer = await promises.readFile ( path );
      let string = buffer.toString ( 'utf-8' );
      const parserResult = parseUsingStore ( details.parserStore, id, string, parser )
      if ( parserResult.error ) return { id, error: parserResult.error }
      return { id, mimeType, result: parserResult.result }
    } catch ( e ) {
      return { id, error: e.message }
    }
  };
