import { LensProps2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkspaceSideEffectPlugin, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";
import { UserTypingBox } from "../userTypingBox";
import { ChatButtons } from "../chatbuttons/chatbuttons";

export interface ChatTempSpace {
  chat: string
}
export function ChatEntryWorkspace<Mid> ( dataFn: WorkspaceStateSideEffectFn<Mid, ChatTempSpace> ): WorkspaceSideEffectPlugin<Mid, ChatTempSpace> {
  return ({
    tabName: 'Chat',
    dataFn,
    display: DisplayChatWorkbench

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplayChatWorkbench<S> ( { state }: LensProps2<S, ChatTempSpace, SideEffect[], any> ) {
  const newState = state.focus1On ( 'chat' )
  return <UserTypingBox state={newState} from='from'/>

}
