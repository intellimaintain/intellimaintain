import { LensProps, LensProps2, LensState } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceSideEffectPlugin, WorkspaceStateFn, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";
import { CommonState } from "./common.state";
import { DashBoardData } from "./dashboard.workspace";

export interface SqlTempSpace<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}

export function SqlWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, SqlTempSpace<Mid, S1>> ): WorkSpacePlugin<Mid, SqlTempSpace<Mid, S1>> {
  return ({
    tabName: 'Sql',
    dataFn,
    display: DisplaySqlWorkbench

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplaySqlWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: SqlTempSpace<S, S1> } ) {
  const {state } = qd
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
