import { LensProps2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkspaceSideEffectPlugin, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";

export interface LdapTempSpace {
  ldap: string
}
export function LdapWorkspace<Mid> ( dataFn: WorkspaceStateSideEffectFn<Mid, LdapTempSpace> ): WorkspaceSideEffectPlugin<Mid, LdapTempSpace> {
  return ({
    tabName: 'Ldap',
    dataFn,
    display: DisplayLdapWorkbench
  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplayLdapWorkbench<S> ( { state }: LensProps2<S, LdapTempSpace, SideEffect[], any> ) {
  const newState = state.focus1On ( 'ldap' )
  return <div><p>Here we can check the users are legitimate</p>
    <p>Two main checks: the person the ticket is for, and the approver.</p>
    <p>We can provide other tools here if we want, but those are the main ones</p>
    <p>These approvals have a 'stale rating', but it can probably be many hours</p>
  </div>
}
