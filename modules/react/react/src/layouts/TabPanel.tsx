import React, { ReactElement } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { toArray } from "@laoban/utils";
import { LensProps2, LensState } from "@focuson/state";

export interface TabPanelDetails {
  title: string
  focuson: any
}

export interface TabPanelProps<S, M, K extends keyof M, C> extends LensProps2<S, M, number, C>, TabPanelDetails {
  children: ( state: LensState<S, M[K], C> ) => ReactElement;
  focuson: K
}

export function TabPanel<S, M, K extends keyof M, C> ( { state, title, focuson, children }: TabPanelProps<S, M, K, C> ) {
  const childState = state.state1 ().focusOn ( focuson )
  return <Box sx={{ overflow: 'auto' }}>
    {children ( childState )}
  </Box>
}

export interface TabsContainerProps<S, M, C> extends LensProps2<S, M, number, C> {
  label: string
  children: React.ReactElement<TabPanelDetails>[] | React.ReactElement<TabPanelDetails>;
}


export function TabsContainer<S, M, C> ( props: TabsContainerProps<S, M, C> ) {
  const { state, children, label } = props;
  const childrenArray = toArray ( children )
  const activeTab = state.optJson2 () || 0
  const selected = childrenArray[ activeTab ]
  function handleChange ( event: React.SyntheticEvent, newValue: number ) {
    state.state2 ().setJson ( newValue, 'tab changed' )
  }
  return (
    <Box>
      <Tabs value={activeTab} onChange={handleChange} aria-label={label}>
        {React.Children.map ( children, ( child ) => (
          <Tab label={child.props.title} key={child.props.focuson}/>
        ) )}
      </Tabs>
      {selected}
    </Box>
  );
}

