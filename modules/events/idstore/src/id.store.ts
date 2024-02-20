import { JSONValue } from "@intellimaintain/utils";

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
