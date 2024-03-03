import { toArray } from "@laoban/utils";
import { SimpleTabPanelProps } from "./TabPanel";
import { LensProps, LensProps2 } from "@focuson/state";
import React from "react";


export interface SilentTabsContainerProps<S, M, C> extends LensProps<S, string, C> {
  children: React.ReactElement<SimpleTabPanelProps>[] | React.ReactElement<SimpleTabPanelProps>;
}
export function SilentTabsContainer<S, M, C> ( props: SilentTabsContainerProps<S, M, C> ) {
  const { state, children } = props;
  const childrenArray = toArray ( children )
  let activeTabName = state.optJson ();
  const rawActiveTab = childrenArray.findIndex ( c => c.props.title === activeTabName )
  const activeTab = rawActiveTab > 0 ? rawActiveTab : 0;
  return childrenArray[ activeTab ].props.children
}