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
    display: DisplaySqlWorkbench

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplaySqlWorkbench<S> ( { state }: LensProps2<S, SqlTempSpace, SideEffect[], any> ) {
  const newState = state.focus1On ( 'sql' )
  return <div><p>SQL Entry goes here</p>
    <p>The Knowledge article controls what kinds of sql are common. This gui is critical to get right.</p>
    <ul>
      <li>We select 'checksql' or 'resolve sql' or 'validate sql'</li>
      <li> We can adust it if we want</li>
      <li> When we click 'go' the result appears in the conversation along with all the details about what we did</li>
      <li> We have the info in the knowledge article to say 'this was OK' or not, and can mark up the result</li>
    </ul>
  </div>

}
