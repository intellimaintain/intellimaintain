import { LensProps, LensProps2, LensState, LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { TabPanelDetails } from "@intellimaintain/components";
import React from "react";

export type WorkspaceStateFn<Mid, WSLens> = ( state: LensState<any, Mid, any> ) => WSLens
export type WorkspaceStateSideEffectFn<Mid, Data> = <S extends any>( state: LensState<S, Mid, any> ) => LensState2<S, Data, SideEffect[], any>
export interface WorkSpacePlugin<Mid, WSLens> {
  tabName: string
  //We just decouple ourselves totally from the state. If we just want a string we get a string. If we want a full state we can have that too.
  //sometimes we will want selection state and sometimes we will want the full state.... we get to pick
  dataFn: WorkspaceStateFn<Mid, WSLens>
  display: ( props: { state: WSLens } ) => React.ReactNode
}
export type WorkspaceSideEffectPlugin<Mid, Data> = WorkSpacePlugin<Mid, LensState2<any, Data, SideEffect[], any>>

export interface HasWorkspacePlugins<Mid> {
  defaultPlugin: WorkSpacePlugin<Mid, any>
  workspacePlugins: WorkSpacePlugin<Mid, any>[]
}

export function WorkSpace<S, Mid, C extends HasWorkspacePlugins<Mid>> ( { state }: LensProps2<S, Mid, string, C> ) {
  const workspacePlugins = state.context.workspacePlugins
  const tabName = state.optJson2 () || '';
  const plugin = workspacePlugins.find ( p => p.tabName === tabName ) || state.context.defaultPlugin;
  return plugin.display ( plugin.dataFn ( state.state1 () ) );
}


