import React from "react";
import { LensProps } from "@focuson/state";
import { DebugState } from "@intellimaintain/react_core";
import { DisplayJson, SimpleTabPanel, TabPanelDetails, TabsContainer } from "@intellimaintain/components";
import { toArray } from "@laoban/utils";

export interface DevModeProps<S> extends LensProps<S, DebugState, any> {
  maxHeight?: string
  maxWidth?: string
  titles: string[]
}
export function DevMode<S> ( { state, titles, maxHeight, maxWidth }: DevModeProps<S> ) {
  const main: any = state.main;
  const panels: React.ReactElement<TabPanelDetails>[] = [
    <SimpleTabPanel title='fullState'><DisplayJson key='fullState' maxWidth={maxWidth} maxHeight={maxHeight} json={main}/></SimpleTabPanel>,
    ...toArray ( titles ).map ( t => <SimpleTabPanel key={t} title={t}><DisplayJson maxWidth={maxWidth} maxHeight={maxHeight} json={main?.[ t ]}/></SimpleTabPanel> )
  ];
  console.log('panels', panels.length, panels.map(p => p.props.title))

  return <TabsContainer label='Dev mode data' state={state.doubleUp ().focus2On ( 'selectedDebugTab' )} children={panels}/>
}
