import { LensProps2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkspaceSideEffectPlugin, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";

export interface SqlTempSpace {
  sql: string
}
export function SqlWorkspace<Mid> ( dataFn: WorkspaceStateSideEffectFn<Mid, SqlTempSpace> ): WorkspaceSideEffectPlugin<Mid, SqlTempSpace> {
  return ({
    tabName: 'Sql',
    dataFn,
    display: SqlEntry

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function SqlEntry<S> ( { state }: LensProps2<S, SqlTempSpace, SideEffect[], any> ) {
  const newState = state.focus1On ( 'sql' )
  return <div>SQL Entry goes here</div>

}
