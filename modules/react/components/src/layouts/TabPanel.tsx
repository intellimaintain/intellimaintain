import React, { ReactElement } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { toArray } from "@laoban/utils";
import { LensProps, LensProps2, LensState, LensState2 } from "@focuson/state";
import { HasSideeffects, SideEffect } from '@intellimaintain/react_core';



export interface TabPanelDetails {
  title: string
}

export interface TabPanelProps<S, M, K extends keyof M, C> extends LensProps2<S, M, number, C>, TabPanelDetails {
  children: ( state: LensState<S, M[K], C> ) => ReactElement;
  focuson: K
}

export function TabPanel<S, M, K extends keyof M, C> ( { state, focuson, children }: TabPanelProps<S, M, K, C> ) {
  const childState = state.state1 ().focusOn ( focuson )
  return <Box sx={{ overflow: 'auto' }}>
    {children ( childState )}
  </Box>
}
export interface SimpleTabPanelProps extends TabPanelDetails {
  children: ReactElement;

}
export function SimpleTabPanel<S, M, C> ( { title, children }: SimpleTabPanelProps ) {
  return <Box sx={{ overflow: 'auto' }}>
    {children}
  </Box>
}
export interface TabPanelWithSideEffectsProps<S, M extends HasSideeffects, K extends keyof M, C> extends LensProps<S, M, C>, TabPanelDetails {
  children: ( state: LensState2<S, M[K], SideEffect[], C> ) => ReactElement;
  focuson: K
}
export function TabWithSideEffects<S, M extends HasSideeffects, K extends keyof M, C> ( { state, focuson, children }: TabPanelWithSideEffectsProps<S, M, K, C> ) {
  const childState = state.doubleUp ().focus1On ( focuson ).focus2On ( 'sideeffects' )
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
  const activeTab = state.optJson2 () || 0;

  function handleChange ( event: React.SyntheticEvent, newValue: number ) {
    state.state2 ().setJson ( newValue, 'tab changed' );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs value={activeTab} onChange={handleChange} aria-label={label}>
        {childrenArray.map ( ( child, index ) => (
          <Tab label={child.props.title} key={child.props.title}/>
        ) )}
      </Tabs>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Ensure the selected TabPanel is rendered here and is the only part scrollable */}
        {React.cloneElement ( childrenArray[ activeTab ], { key: activeTab } )}
      </Box>
    </Box>
  );
}

export function TabsContainer2<S, M, C> ( props: TabsContainerProps<S, M, C> ) {
  const { state, children, label } = props;
  const childrenArray = toArray ( children )
  const activeTab = state.optJson2 () || 0
  const selected = childrenArray[ activeTab ]
  function handleChange ( event: React.SyntheticEvent, newValue: number ) {
    state.state2 ().setJson ( newValue, 'tab changed' )
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Tabs value={activeTab} onChange={handleChange} aria-label={label} variant="scrollable" scrollButtons="auto">
        {React.Children.map ( children, ( child ) => (
          <Tab label={child.props.title} key={child.props.title}/>
        ) )}
      </Tabs>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* This Box will contain the selected tab content and will be scrollable */}
        {selected}
      </Box>
    </Box>
  );
  // return (
  //   <Box>
  //     <Tabs value={activeTab} onChange={handleChange} aria-label={label}>
  //       {React.Children.map ( children, ( child ) => (
  //         <Tab label={child.props.title} key={child.props.focuson}/>
  //       ) )}
  //     </Tabs>
  //     {selected}
  //   </Box>
  // );
}

