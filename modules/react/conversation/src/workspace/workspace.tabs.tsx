import React from "react";
import { Box } from "@mui/material";
import { LensProps2 } from "@focuson/state";
import { TabsContainer } from "@intellimaintain/components/dist/src/layouts/TabPanel";
import { HasWorkspacePlugins, WorkSpacePlugin, WorkspaceTabProps } from "./workspace";

export function WorkspaceTab<S, Mid, WSLens> ( { state, plugin }: WorkspaceTabProps<S, Mid, WSLens> ) {
  return <Box sx={{}}>
    {plugin.display ( { state: plugin.dataFn ( state ) } )}
  </Box>
}

export function WorkspaceTabs<S, Mid, C extends HasWorkspacePlugins<Mid>> ( { state }: LensProps2<S, Mid, number, C> ) {
  const defaultPlugin: WorkSpacePlugin<Mid, any> = state.context.defaultPlugin
  const workspacePlugins: WorkSpacePlugin<Mid, any>[] = state.context.workspacePlugins || []
  return <TabsContainer label='Workspace' state={state}>
    <WorkspaceTab title={defaultPlugin.tabName} state={state.state1 ()} plugin={defaultPlugin}/>
    <>{workspacePlugins.map ( ( plugin, index ) => (
      <WorkspaceTab key={defaultPlugin.tabName} title={defaultPlugin.tabName} state={state.state1 ()} plugin={plugin}/>
    ) )}</>
  </TabsContainer>
}
