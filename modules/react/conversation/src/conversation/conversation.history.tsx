import React, { ReactElement, ReactNode } from "react";
import { LensProps } from "@focuson/state";
import { BaseMessage, Conversation } from "@intellimaintain/domain";
import { SimpleTabPanelProps } from "@intellimaintain/components";
import { safeArray, toArray } from "@laoban/utils";
import { Lenses } from "@focuson/lens";

export interface HistoryProps<S, T> extends LensProps<S, T, any> {
  def: ( msg: BaseMessage | undefined ) => React.ReactElement
  children: React.ReactElement<SimpleTabPanelProps> | React.ReactElement<SimpleTabPanelProps>[]
}

export function DisplayMessage<S> ( { state, children, def }: HistoryProps<S, BaseMessage> ): ReactElement {
  const message = state.optJson ();
  const type = message?.type;
  const child = toArray ( children ).find ( c => c.props.title === type );
  return child ? child.props.children : def ( message )
}
export function ConversationHistory<S> ( { state, children, def }: HistoryProps<S, Conversation> ) {
  const conversation = state.optJson ();
  const messages = safeArray ( conversation?.messages );
  return <>{messages.map ( ( message, i ) =>
    <DisplayMessage key={i} def={def} children={children} state={state.focusOn ( 'messages' ).chainLens ( Lenses.nth ( i ) )}/> )}</>
}

