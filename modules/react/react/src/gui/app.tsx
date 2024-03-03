import { LensProps, LensProps2 } from "@focuson/state";
import { ThemeProvider } from "@mui/material";
import { SimpleTabPanel, TemplateFn, theme } from "@intellimaintain/components";
import { DisplayGui } from "./gui";
import React, { ReactNode } from "react";
import { CommonState, SideEffect } from "@intellimaintain/react_core";
import { ColumnLeftMainRowBottom } from "@intellimaintain/components";
import { UserTypingBox } from "@intellimaintain/react_conversation";
import { ItsmState } from "../state/itsm.state";
import { DisplayConversion2, ConversationHistory } from "@intellimaintain/react_conversation";
import { BaseMessage, Conversation } from "@intellimaintain/domain";

export interface AppProps<S, CS extends CommonState> extends LensProps<S, CS, any> {
}


export interface HistoryProps<S> extends LensProps<S, Conversation, any> {

}
export function HistoryBox<S> ( { state }: HistoryProps<S> ) {
  const conversation = state.optJson ()
  const def = ( msg: BaseMessage |undefined) => <div>
    <pre>{JSON.stringify ( msg )}</pre>
  </div>
  return <ConversationHistory state={state} def={def}>
    <SimpleTabPanel title='one'>
      <div>Some</div>
    </SimpleTabPanel>
  </ConversationHistory>
}
export interface ChatBoxProps<S> extends LensProps2<S, Conversation, SideEffect[], any> {
}
export function ChatBox<S> ( { state }: ChatBoxProps<S> ) {
  const userTypingState = state.focus1On ( 'message' )
  const def = <UserTypingBox state={userTypingState} from='me'/>
  return <DisplayConversion2 state={state.state1 ()} def={def}>
    <SimpleTabPanel title='one'>
      <div>Some</div>
    </SimpleTabPanel>
  </DisplayConversion2>
}
export function App<S> ( { state }: AppProps<S, ItsmState> ) {
  return<>

  return <ThemeProvider theme={theme}>
    <ColumnLeftMainRowBottom title='ITSM Workbench' state={state.focusOn ( "selectionState" ).focusOn ( 'mainScreen' )}
                             Nav={<div>Settings/tickets</div>}
                             Main={<HistoryBox state={state.focusOn ( 'conversation' )}/>}
                             Typing={<ChatBox state={state.doubleUp ().focus1On ( 'conversation' ).focus2On ( 'sideeffects' )}/>}
                             layout={{ drawerWidth: '240px', height: '100vh' }}/>
  </ThemeProvider>
  </>
}
