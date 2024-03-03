import { ConversationHistory } from "./conversation.history";
import { DisplayChatArea } from "./conversation.chatarea";
import { UserTypingBox } from "./userTypingBox";
import React, { ReactNode } from "react";
import { LensProps2 } from "@focuson/state";
import { Conversation } from "@intellimaintain/domain";
import { SideEffect } from "@intellimaintain/react_core";
import { ConversationPlugin } from "./conversation.plugin";
import { MainAndTypingLayout } from "@intellimaintain/components";

export interface ConversationHistoryAndChatProps<S> extends LensProps2<S, Conversation, SideEffect[], any> {
  plugins: ConversationPlugin<S>[]
  devMode?: ReactNode
}
export function ConversationHistoryAndChat<S> ( { state, plugins, devMode }: ConversationHistoryAndChatProps<S> ) {
  return <MainAndTypingLayout
    Main={<ConversationHistory plugins={plugins} state={state.state1 ()} def={m => <div>{JSON.stringify ( m )}</div>}/>}
    Typing={
      <><DisplayChatArea plugins={plugins} state={state} def={
        <UserTypingBox state={state.focus1On ( 'chat' ).focus1On ( 'data' )} from='me'/>}/>
        {devMode}
      </>}
  />
}

