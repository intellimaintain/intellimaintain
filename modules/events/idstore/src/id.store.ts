import { JSONValue } from "@intellimaintain/utils";
import { KeyAndPath } from "./file.id.store";

export function findIdKeyAndPath ( s: string ):KeyAndPath {
  const index = s.indexOf ( ':' )
  if ( index === -1 ) throw Error ( `Invalid id no ':' in ${s}]` )
  const key = s.slice ( 0, index )
  const path = s.slice ( index + 1 ).replace ( /:/g, '/' )
  return { key, path };
}

export type  IdStore = ( id: string , parser: string) => Promise<IdStoreResult>

export const NoIdStore: IdStore = async id => ({ id, error: 'No Id Store' })

export type  GoodIdStoreResult = {
  id: string
  mimeType: string
  result: JSONValue
}
export function isGoodIdStoreResult ( x: IdStoreResult ): x is GoodIdStoreResult {
  return (x as GoodIdStoreResult).mimeType !== undefined
}
export type  BadIdStoreResult = {
  id: string
  error: string
}
export function isBadIdStoreResult ( x: IdStoreResult ): x is BadIdStoreResult {
  return (x as BadIdStoreResult).error !== undefined
}
export type  IdStoreResult = GoodIdStoreResult | BadIdStoreResult
