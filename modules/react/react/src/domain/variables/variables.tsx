import { LensProps, LensProps2 } from "@focuson/state";
import React from "react";
import { SideEffect } from "../../sideeffects/sideeffects";
import { extractVariablesFrom, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { DisplayMarkdown } from "../../components/display.markdown";
import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { SelectedAndList } from "../domain";
import { IdAndName } from "@intellimaintain/domain";

export function extractVariablesFromSelectedAndList<T extends IdAndName> ( ve: VariablesExtractor, context: string, se: SelectedAndList<T> ): Variables {
  function error ( msg: string ) {return { variables: {}, errors: [ msg ] } }
  if ( se.selected === undefined ) return error ( `No ${context} selected` )
  if ( se.item === undefined ) return error ( `No ${context} loaded (id is ${se.selected})` )
  console.log ( 'extractVariablesFromSelectedAndList', 'selected', se.selected, 'item', se.item )
  return extractVariablesFrom ( ve, se.selected, se.item )
}

export function DisplayVariablesFromOnePlace<S> ( { state }: LensProps<S, NameAnd<Variables>, any> ) {
  return <></>

}

export function DisplayVariables<S> ( { state }: LensProps2<S, NameAnd<Variables>, SideEffect[], any> ) {
  const md = JSON.stringify ( state.state1 ().optJson () || {}, null, 2 )
  return <DisplayMarkdown md={'```\n' + md + '\n```'} maxHeight='35vh'/>

}