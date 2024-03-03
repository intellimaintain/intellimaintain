import React from "react";
import { Box } from "@mui/material";
import { LensProps, LensProps2 } from "@focuson/state";
import { TabPanelDetails, TabsContainer } from "@intellimaintain/components";
import { HasWorkspacePlugins, WorkSpacePlugin } from "./workspace";
import { safeArray, toArray } from "@laoban/utils";

export interface WorkspaceTabProps<S, Mids, WSLens> extends LensProps<S, Mids, any>, TabPanelDetails {
  plugin: WorkSpacePlugin<Mids, WSLens>
  children?: React.ReactNode
  height?: string
}
export function WorkspaceTab<S, Mid, WSLens> ( { height, state, plugin }: WorkspaceTabProps<S, Mid, WSLens> ) {
  return <Box sx={{ height }}>
    {plugin.display ( { state: plugin.dataFn ( state ) } )}
  </Box>
}

export interface WorkspaceTabsProps<S, Mid, C> extends LensProps2<S, Mid, string|undefined, C> {
  height?: string
  children?: React.ReactElement<TabPanelDetails>[] | React.ReactElement<TabPanelDetails>
}


export function WorkspaceTabsWithPlugins<S, Mid, C extends HasWorkspacePlugins<Mid>> ( { state, children, height }: WorkspaceTabsProps<S, Mid, C> ) {
  const defaultPlugin: WorkSpacePlugin<Mid, any> = state.context.defaultPlugin
  const workspacePlugins: WorkSpacePlugin<Mid, any>[] = state.context.workspacePlugins || []
  console.log ( 'WorkspaceTabs', 'workspacePlugins', workspacePlugins )
  const def: React.ReactElement<TabPanelDetails> = <WorkspaceTab title={defaultPlugin.tabName} state={state.state1 ()} plugin={defaultPlugin}/>
  const plugins: React.ReactElement<TabPanelDetails>[] = workspacePlugins.map ( ( plugin, index ) => (
    <WorkspaceTab key={plugin.tabName} title={plugin.tabName} state={state.state1 ()} plugin={plugin}/>
  ) )
  const childrenAsArray: React.ReactElement<TabPanelDetails>[] = safeArray<React.ReactElement<TabPanelDetails>> ( children )
  const allChildren: React.ReactElement<TabPanelDetails>[] = [ def, ...plugins, ...childrenAsArray ]
  return <TabsContainer height={height} label='Workspace' state={state} children={allChildren}/>

}
