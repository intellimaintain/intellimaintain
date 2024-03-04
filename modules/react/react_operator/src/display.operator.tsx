import React, { ReactElement } from "react";
import { LensState, LensState2 } from "@focuson/state";
import { AttributeTable, EditAttributesTable, FocusedTextInput, makeSideeffectForMessage } from "@intellimaintain/components";
import { BaseMessage, ChatDisplayData, Operator } from "@intellimaintain/domain";
import { Lens } from "@focuson/lens";
import { ConversationPlugin } from "@intellimaintain/react_conversation";
import { Button, Paper } from "@mui/material";
import { SideEffect } from "@intellimaintain/react_core";
import { NameAnd } from "@laoban/utils";

const pleaseString = `Please tell me about yourself so that when I send emails and messages for you I can use your correct details`

export type OperatorDetailsMessage = { type: 'operatorDetails', operator: Operator, who: string }
export function isOperatorDetailsMessage ( message: BaseMessage|undefined ): message is OperatorDetailsMessage {
  return message?.type === 'operatorDetails'

}

export function displayOperatorDetails<S extends any> ( state: LensState<S, BaseMessage, any> ): ReactElement {
  let message = state.optJson ();
  console.log ( 'displayOperatorDetails', message )
  if ( !isOperatorDetailsMessage ( message ) ) return <>Error should be operator details message was ${JSON.stringify ( message )}</>
  const operator: NameAnd<string> = message.operator as any
  console.log ( 'displayOperatorDetails', operator )
  return <div><Paper elevation={3} style={{ padding: 20, height: '100%', overflow: 'auto' }}>{pleaseString}</Paper> <AttributeTable rows={operator}/></div>
}

export const editOperatorDetails = <S extends any> ( operatorL: Lens<S, Operator> ) => ( state: LensState2<S, ChatDisplayData<any>, SideEffect[], any> ): ReactElement => {
  const msg = state.optJson1 () || '';
  return <><p>Please tell me about yourself so that when I send emails and messages for you I can use your correct details</p>
    <EditAttributesTable state={state.state1 ().copyWithLens ( operatorL )} attributes={{ name: {}, email: {} }}>{
      ( key, ad, state ) => [ <div>{ad.name}</div>, <FocusedTextInput state={state}/> ]
    }</EditAttributesTable>
    <Button variant='contained' onClick={() => {
      let operator = operatorL.get ( state.main );
      state.transformJson (
        chat => ({ type: 'unknown' }),
        old => [ ...(old ?? []),
          { command: "event", event: { "event": "setValue", "path": "operator", "value": operator, "context": {} } },
          //here we will also update the operator in the file system
          makeSideeffectForMessage ( { type: 'operatorDetails', operator: operator, who: operator.name } ) ], '' )
    }}>Save</Button>
  </>
}
//  <Button startIcon={<FastForwardIcon/>} onClick={() => {
//       state.state2 ().transform (
//         old => [ ...(old ?? []), makeSideeffectForMessage ( { type: 'message', message: buttonData.message, who } ) ], '' )
//     }}> Quickly </Button>
export function operatorConversationPlugin<S> ( operatorL: Lens<S, Operator> ): ConversationPlugin<S> {
  return {
    type: 'operatorDetails',
    view: displayOperatorDetails,
    chat: editOperatorDetails ( operatorL )
  }
}