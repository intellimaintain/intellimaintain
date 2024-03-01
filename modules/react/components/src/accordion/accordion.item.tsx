import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NameAnd, safeArray } from "@laoban/utils";
import { LensProps, LensProps2, LensState } from "@focuson/state";
import { splitAndCapitalize } from "@intellimaintain/utils";
import { Lenses } from "@focuson/lens";

export type AccordionState = string
export interface AccordionItemProps<S> extends LensProps<S, AccordionState, any> {
  name: string
  title: React.ReactNode
  children: React.ReactNode
}
export function AccordionItem<S> ( { state, name, children }: AccordionItemProps<S> ) {
  const expanded = state.optJson ()
  const handleChange = ( event: React.ChangeEvent<{}>, isExpanded: boolean ) => state.setJson ( isExpanded ? name :'', '' )
  return <Accordion expanded={expanded === name} onChange={handleChange}>
    <AccordionSummary expandIcon={<ExpandMoreIcon/>} aria-controls={`${name}-content`} id={`${name}-header`}>{name}</AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
}

export interface AccordionListProps<S, T> extends LensProps2<S, T[], AccordionState, any> {
  name: string
  title: React.ReactNode
  children: ( state: LensState<S, T, any> ) => React.ReactNode
}

export function AccordionList<S, T> ( { state, name, title, children }: AccordionListProps<S, T> ) {
  const actualChildren = safeArray ( state.optJson1 () ).map ( ( item, index ) =>
    children ( state.state1 ().chainLens ( Lenses.nth ( index ) ) ) )
  return <AccordionItem state={state.state2 ()} name={name} title={title} children={actualChildren}/>
}

//The second string is the place we store the 'selected' item
export interface AccordionExplicitListProps<S, T> extends LensProps2<S, AccordionState, string, any> {
  name: string
  title: React.ReactNode
  list: string[]
  children: ( s: string, state: LensState<S, string, any>, selected: boolean ) => React.ReactNode

}
export function AccordionExplicitList<S> ( { state, name, title, list, children }: AccordionExplicitListProps<S, string> ) {
  const selected = state.optJson2 ()
  const selectedState = state.state2 ()
  const actualChildren = safeArray (list ).map ( ( item, index ) =>
    children ( item, selectedState, item === selected ) )
  return <AccordionItem state={state.state2 ()} name={name} title={title} children={actualChildren}/>
}