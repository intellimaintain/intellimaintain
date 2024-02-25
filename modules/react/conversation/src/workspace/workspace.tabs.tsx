import React from "react";
import { Box } from "@mui/material";
import { LensProps, LensProps2 } from "@focuson/state";
import { TabPanelDetails, TabsContainer } from "@intellimaintain/components";
import { HasWorkspacePlugins, WorkSpacePlugin } from "./workspace";

export interface WorkspaceTabProps<S, Mids, WSLens> extends LensProps<S, Mids, any>, TabPanelDetails {
  plugin: WorkSpacePlugin<Mids, WSLens>
}
export function WorkspaceTab<S, Mid, WSLens> ( { state, plugin }: WorkspaceTabProps<S, Mid, WSLens> ) {
  return <Box sx={{}}>
    {plugin.display ( { state: plugin.dataFn ( state ) } )}
  </Box>
}

export function WorkspaceTabs<S, Mid, C extends HasWorkspacePlugins<Mid>> ( { state }: LensProps2<S, Mid, number, C> ) {
  const defaultPlugin: WorkSpacePlugin<Mid, any> = state.context.defaultPlugin
  const workspacePlugins: WorkSpacePlugin<Mid, any>[] = state.context.workspacePlugins || []
  console.log ( 'WorkspaceTabs', 'workspacePlugins', workspacePlugins )
  const def= <WorkspaceTab title={defaultPlugin.tabName} state={state.state1 ()} plugin={defaultPlugin}/>
  const plugins =workspacePlugins.map ( ( plugin, index ) => (
    <WorkspaceTab key={plugin.tabName} title={plugin.tabName} state={state.state1 ()} plugin={plugin}/>
  ) )
  return <TabsContainer label='Workspace' state={state} children = {[def,...plugins]}/>

}
