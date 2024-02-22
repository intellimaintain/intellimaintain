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

export function extractVariablesFromSelectedAndList<T extends IdAndName> ( ve: VariablesExtractor, context: string, se: SelectedAndList<T> ): Variables {
  function error ( msg: string ) {return { variables: {}, errors: [ msg ] } }
  if ( se.selected === undefined ) return error ( `No ${context} selected` )
  if ( se.item === undefined ) return error ( `No ${context} loaded (id is ${se.selected})` )
  console.log ( 'extractVariablesFromSelectedAndList', 'selected', se.selected, 'item', se.item )
  return extractVariablesFrom ( ve, se.selected, se.item )
}

export function extractVariablesAndAddToState ( chat: ChatState ) {
  const ve = defaultVariablesExtractor
  const variables: NameAnd<Variables> = {
    Ticket: extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.tickets ),
    'Knowledge Article': extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.kas ),
    'Software Catalog': extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.scs )
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
        <List disablePadding>
          {Object.entries ( variables.variables ).length > 0 ? (
            Object.entries ( variables.variables ).map ( ( [ key, value ], index ) => (
              <ListItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" component="span" style={{ flexBasis: '20%', textAlign: 'left', marginRight: '16px' }}>
                  {`${key}:`}
                </Typography>
                <Typography variant="body1" component="span" style={{ flexBasis: '80%' }}>
                  {value}
                </Typography>
              </ListItem>
            ) )
          ) : (
            <ListItem>
              <ListItemText primary="No variables"/>
            </ListItem>
          )}
          {variables.errors.map ( ( error, index ) => (
            <ListItem key={`error-${index}`} style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              <ListItemIcon>
                <ErrorIcon color="error"/>
              </ListItemIcon>
              <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2' }}/>
            </ListItem>
          ) )}
        </List>
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