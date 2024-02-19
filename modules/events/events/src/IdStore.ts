import { JSONValue } from "@intellimaintain/utils";


export type  IdStore = ( id: string ) => Promise<JSONValue>

export const NoIdStore: IdStore = () => Promise.reject ( 'No Id Store' )

export type  IdStoreResult = {
  id: string
  result?: JSONValue
  error?: string
}
export type GetIdFromStoreFn = ( idStore: IdStore, id: string ) => Promise<IdStoreResult>
export const getId: GetIdFromStoreFn = async ( idStore: IdStore, id: string ): Promise<IdStoreResult> => {
  try {
    return { id, result: await idStore ( id ) }
  } catch ( e ) {
    return { id, error: e.message }
  }
};

