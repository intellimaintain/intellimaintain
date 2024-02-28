import React from "react";
import { LensProps2 } from "@focuson/state";
import { DisplayYaml, DropdownAsTitle } from "@intellimaintain/components";
import { SideEffect } from "@intellimaintain/react_core";
import { SoftwareCatalogs } from "@intellimaintain/softwarecatalog";


export function DisplaySoftwareCatalogs<S> ( { state, path }: LensProps2<S, SoftwareCatalogs, SideEffect[], any> &{path:string}) {
  return <DropdownAsTitle state={state} path={path} purpose='Software Catalog' parser='sc'>{
    state =>  <DisplayYaml yamlContent={state.optJson()}/>
  }</DropdownAsTitle>
}