import React from "react";
import { Box } from "@mui/material";
import { LensProps, LensProps2 } from "@focuson/state";
import { TabPanelDetails, TabsContainer } from "@intellimaintain/components";
import { HasWorkspacePlugins, WorkSpacePlugin } from "./workspace";
import { toArray } from "@laoban/utils";

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

export interface WorkspaceTabsProps<S, Mid, C> extends LensProps2<S, Mid, number, C> {
  height?: string
  children?: React.ReactElement<TabPanelDetails>[] | React.ReactElement<TabPanelDetails>
}

export function WorkspaceTabs<S, Mid, C extends HasWorkspacePlugins<Mid>> ( { state, children, height }: WorkspaceTabsProps<S, Mid, C> ) {
  const defaultPlugin: WorkSpacePlugin<Mid, any> = state.context.defaultPlugin
  const workspacePlugins: WorkSpacePlugin<Mid, any>[] = state.context.workspacePlugins || []
  console.log ( 'WorkspaceTabs', 'workspacePlugins', workspacePlugins )
  const def = <WorkspaceTab title={defaultPlugin.tabName} state={state.state1 ()} plugin={defaultPlugin}/>
  const plugins = workspacePlugins.map ( ( plugin, index ) => (
    <WorkspaceTab key={plugin.tabName} title={plugin.tabName} state={state.state1 ()} plugin={plugin}/>
  ) )
  return <TabsContainer height={height} label='Workspace' state={state} children={[ def, ...plugins, ...toArray ( children ) ]}/>

}
