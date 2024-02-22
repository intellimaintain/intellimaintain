import React from "react";
import { LensProps2 } from "@focuson/state";
import { SoftwareCatalog } from "@intellimaintain/softwarecatalog";
import { DisplayMarkdown, DropdownAsTitle } from "@intellimaintain/components";
import { SelectedAndList, SideEffect } from "@intellimaintain/react_core";

export type SoftwareCatalogs = SelectedAndList<SoftwareCatalog>

export function DisplaySoftwareCatalogs<S> ( { state, path }: LensProps2<S, SoftwareCatalogs, SideEffect[], any> &{path:string}) {
  return <DropdownAsTitle state={state} path={path} purpose='Software Catalog' parser='sc'>{
    state =>  <DisplayMarkdown md={state.focusOn ( 'body' ).optJson()}/>
  }</DropdownAsTitle>
}