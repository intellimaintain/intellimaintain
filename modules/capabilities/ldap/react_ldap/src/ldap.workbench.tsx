import React from "react";
import { FocusedTextArea, QueryResponseLayout } from "@intellimaintain/components";
import { LensProps } from "@focuson/state";
import { isActionSqlWorkbenchState, RawSqlWorkbenchState, SqlWorkbenchState } from "@intellimaintain/react_core";
import { ActionSqlWorkbenchState } from "@intellimaintain/react_core";
import { Button } from "@mui/material";
import { TestConnectionButton } from "@intellimaintain/react_softwarecatalog";

export interface DisplaySqlWorkbenchProps<S, S1> extends LensProps<S, S1, any> {
  maxHeight?: string
  maxWidth?: string
}


export function DisplaySqlWorkbenchForRaw<S> ( { state }: DisplaySqlWorkbenchProps<S, RawSqlWorkbenchState> ) {
  console.log ( "for raw" )
  return <QueryResponseLayout
    requestTitle={"SQL"}
    request={<FocusedTextArea state={state.focusOn ( 'sql' )}/>}
    requestButtons={[ <Button variant='contained'>Execute</Button>, <TestConnectionButton/> ]}

    responseTitle={"Result"}
    response={<FocusedTextArea state={state.focusOn ( 'response' )}/>}
    responseButtons={[]}
  />
}

export function DisplaySqlWorkbenchForAction<S, S1 extends SqlWorkbenchState> ( { state }: DisplaySqlWorkbenchProps<S, ActionSqlWorkbenchState> ) {
  return <QueryResponseLayout
    requestTitle={"SQL"}
    request={<FocusedTextArea state={state.focusOn ( 'sql' )}/>}
    requestButtons={[ <Button variant='contained'>Execute</Button>, <TestConnectionButton/> ]}
    responseTitle={"Result"}
    response={<FocusedTextArea state={state.focusOn ( 'response' )}/>}
    responseButtons={[]}
  />
}
export function DisplaySqlWorkbench<S, S1 extends SqlWorkbenchState> ( props: DisplaySqlWorkbenchProps<S, S1> ) {
  const s: SqlWorkbenchState = props.state.optJson () || { sql: '', response: '' }

  if ( isActionSqlWorkbenchState ( s ) ) {
    const castprops = props as any as DisplaySqlWorkbenchProps<S, ActionSqlWorkbenchState>
    return <DisplaySqlWorkbenchForAction {...castprops} />
  } else {
    const castprops = props as any as DisplaySqlWorkbenchProps<S, RawSqlWorkbenchState>
    return <DisplaySqlWorkbenchForRaw {...castprops} />
  }
}