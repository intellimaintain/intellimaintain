import { NameAnd } from "@laoban/utils";
import { promises } from "fs";
import { IdStore, IdStoreResult } from "./id.store";

export interface IdStoreDetails {
  extension: string
  rootPath: string
}

/** WIth an id like ks:first:part:file ... then ks points to the IdStoreDetails. The rest is the path to the file and we had an extension to it */
export type AllIdStoreDetails = NameAnd<IdStoreDetails>

export function idPathToFilePath ( details: AllIdStoreDetails, s: string ): string {
  const index = s.indexOf ( ':' )
  if ( index === -1 ) throw Error ( `Invalid id no ':' in ${s}]` )
  const key = s.slice ( 0, index )
  const path = s.slice ( index + 1 ).replace ( /:/g, '/' )
  const d = details[ key ]
  if ( !d ) throw Error ( `No details for ${key}. Legal values are ${Object.keys ( details )}` )
  return `${d.rootPath}/${path}.${d.extension}`
}

export function defaultIdStoreDetails ( root: string ): AllIdStoreDetails {
  return {
    ks: { extension: 'md', rootPath: `${root}/ka}` },
    sca: { extension: 'md', rootPath: `${root}/scas` },
    ticket: { extension: 'events.txt', rootPath: `${root}/tickets` }
  }
}
export const loadFromIdStore = ( details: AllIdStoreDetails ): IdStore =>
  async ( id: string ): Promise<IdStoreResult> => {
    try {
      const path = idPathToFilePath ( details, id )
      let buffer = await promises.readFile ( path );
      return { id, result: buffer.toString ( 'utf-8' ) }
    } catch ( e ) {
      return { id, error: e.message }
    }
  };
