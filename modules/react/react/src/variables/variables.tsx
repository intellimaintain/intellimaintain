import { LensProps2 } from "@focuson/state";
import React from "react";
import { extractVariablesFrom, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { SelectedAndList, SideEffect } from "@intellimaintain/react_core";
import { IdAndName } from "@intellimaintain/domain";
import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

import { defaultVariablesExtractor } from "@intellimaintain/defaultdomains";
import { ChatState } from "../domain/domain";
import { DisplayYaml } from "@intellimaintain/components";
import { JSONObject } from "@intellimaintain/utils";

export function extractVariablesFromSelectedAndList<T extends IdAndName> ( ve: VariablesExtractor, context: string, soFar: JSONObject, se: SelectedAndList<T> ): Variables {
  function error ( msg: string ) {return { variables: {}, errors: [ msg ] } }
  if ( se.selected === undefined ) return error ( `No ${context} selected` )
  if ( se.item === undefined ) return error ( `No ${context} loaded (id is ${se.selected})` )
  console.log ( 'extractVariablesFromSelectedAndList', 'selected', se.selected, 'item', se.item )
  return extractVariablesFrom ( ve, se.selected, soFar, se.item )
}

export function extractVariablesAndAddToState ( chat: ChatState ): ChatState {
  const ve = defaultVariablesExtractor
  const operator: Variables = { variables: { 'operator': { email: chat.who, name: 'phil' } }, errors: [] }
  let ticket: Variables = extractVariablesFromSelectedAndList ( ve, 'Ticket', operator.variables, chat.tickets );
  const soFar: JSONObject = { ...operator.variables, ...ticket.variables }
  let ka = extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', soFar, chat.kas );
  const soFarWithVariables: JSONObject = { ...soFar, ...ka.variables }
  let sc = extractVariablesFromSelectedAndList ( ve, 'Software Catalog', soFarWithVariables, chat.scs );
  const summary: JSONObject = { ...soFarWithVariables, ...sc.variables }
  const allErrors = [ operator.errors, ticket.errors, ka.errors, sc.errors ].flat ()
  const variables: NameAnd<Variables> = {
    Operator: operator,
    Ticket: ticket,
    'Knowledge Article': ka,
    'Software Catalog': sc,
    'Summary': { variables: summary, errors: allErrors }
  }
  return { ...chat, variables }
}

export type DisplayVariablesProps = {
  variables: Variables
}
export function DisplayVariablesFromOnePlace ( { variables }: DisplayVariablesProps ) {
  return <></>

}

export type VariablesCardProps = {
  variables: Variables
  title: string
}
function SectionCard ( { title, variables }: VariablesCardProps ) {
  return (
    <Card variant="outlined" style={{ margin: '16px 0' }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <DisplayYaml yamlContent={variables.variables}/>
        {variables.errors.length > 0 && <List>
          {variables.errors.map ( ( error, index ) => (
            <ListItem key={`error-${index}`} style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              <ListItemIcon>
                <ErrorIcon color="error"/>
              </ListItemIcon>
              <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2' }}/>
            </ListItem>
          ) )}</List>}
      </CardContent>
    </Card>
  );
}


export function DisplayVariables<S> ( { state }: LensProps2<S, NameAnd<Variables>, SideEffect[], any> ) {
  const variables = state.state1 ().optJson () || {}

  return <div style={{ display: 'flex', flexDirection: 'column', height: '35vh' }}>
    <div style={{ flexGrow: 1, overflowY: 'scroll' }}>
      {Object.entries ( variables ).map ( ( [ title, variables ], index ) => (
        <SectionCard
          key={index}
          title={title}
          variables={variables}
        />
      ) )}
    </div>
  </div>

}