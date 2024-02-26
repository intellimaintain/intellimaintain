import { LensProps2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkspaceSideEffectPlugin, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";

export interface EmailTempSpace {
  email: string
}
export function EmailWorkspace<Mid> ( dataFn: WorkspaceStateSideEffectFn<Mid, EmailTempSpace> ): WorkspaceSideEffectPlugin<Mid, EmailTempSpace> {
  return ({
    tabName: 'Email',
    dataFn,
    display: DisplayEmail

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplayEmail<S> ( { state }: LensProps2<S, EmailTempSpace, SideEffect[], any> ) {
  const newState = state.focus1On ( 'email' )
  return <div><p>Email Entry goes here</p>
    <p>The Knowledge article controls what kinds of email are common. This gui is critical to get right.</p>
    <p>Examples</p>
    <ul>
      <li>Approval email</li>
      <li>Finished email to user</li>
      <li>Finished email to approver (or maybe we cc to the above?)</li>
    </ul>
  </div>

}
