import React, { ReactElement } from "react";
import { LensProps } from "@focuson/state";
import { BaseMessage, Conversation } from "@intellimaintain/domain";
import { safeArray, toArray } from "@laoban/utils";
import { Lenses } from "@focuson/lens";
import { ConversationPlugin } from "./conversation.plugin";

export interface HistoryProps<S, T> extends LensProps<S, T, any> {
  def: ( msg: BaseMessage | undefined ) => React.ReactElement
  plugins: ConversationPlugin<S>[]
}

export function DisplayMessage<S> ( { state, plugins, def }: HistoryProps<S, BaseMessage> ): ReactElement {
  const message = state.optJson ();
  const type = message?.type;
  const child = toArray ( plugins ).find ( p => p.type === type );
  return child ? child.view ( state ) : def ( message )
}
export function ConversationHistory<S> ( { state, plugins, def }: HistoryProps<S, Conversation> ) {
  const conversation = state.optJson ();
  const messages = safeArray ( conversation?.messages );
  const messagesState = state.focusOn ( 'messages' )
  return <>{messages.map ( ( message, i ) =>
    <DisplayMessage key={i} def={def} plugins={plugins} state={messagesState.chainLens ( Lenses.nth ( i ) )}/> )}</>
}

