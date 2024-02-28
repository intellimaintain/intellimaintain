import { ActionStatus } from "@intellimaintain/actions";
import { LensState } from "@focuson/state";
import { calculateActionDetails, CommonStateForActionDetails } from "./common.state";

export interface RawSqlWorkbenchState {
  sql: string
}
export function isRawSqlWorkbenchState ( state: SqlWorkbenchState ): state is RawSqlWorkbenchState {
  return (state as any).purpose === undefined
}
export interface ActionSqlWorkbenchState {
  sql: string
  purpose: string
  actionName?: string
}
export function isActionSqlWorkbenchState ( state: SqlWorkbenchState ): state is ActionSqlWorkbenchState {
  return (state as ActionSqlWorkbenchState).purpose !== undefined
}

export type SqlWorkbenchState = RawSqlWorkbenchState | ActionSqlWorkbenchState
export interface HasSqlWorkbenchState {
  sqlWorkbench: SqlWorkbenchState
}

export interface SqlPrefiledDetails {
  variables: any
  sql?: string
  type?: string
  correctWhen?: string
  title?: string
  actionName?: string
}

function getSqlPrefiledDetailsIfExist<S, S1 extends CommonStateForActionDetails> ( state: LensState<S, S1, any> ) {
  const { knowledgeArticle, action, variables, title, actionName } = calculateActionDetails ( state, 'sql' );
  const type: string = (action as any)?.type?.toString () || ''
  const sqlData: any = (knowledgeArticle as any)?.sql?.[ type ]
  const sql = sqlData?.sql
  const correctWhen = sqlData?.correctWhen
  return { sql, variables, type, correctWhen, title, actionName }

}
export function actionSqlWorkbenchState ( actionStatus: ActionStatus ) {

}
