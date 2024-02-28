import React from "react";
import { LensProps, LensProps2 } from "@focuson/state";
import { SideEffect } from '@intellimaintain/react_core';
import { DisplayText, DropdownAsTitle } from "@intellimaintain/components";
import { Template, Templates } from "@intellimaintain/templates";


export function DisplayTemplate<S> ( { state }: LensProps<S, Template, any> ) {
  const template = state.json ()
  return <DisplayText text={template.template}/>
}
export function DisplayTemplates<S> ( { path, state }: LensProps2<S, Templates, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Template' parser='template'>{
    state => <DisplayTemplate state={state}/>
  }</DropdownAsTitle>
}