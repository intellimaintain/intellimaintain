import React from 'react';
import ReactDOM from 'react-dom/client';
import { LensProps, lensState } from "@focuson/state";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { Box, ThemeProvider } from "@mui/material";
import { DI } from "./DI/DI";
import { blankChatState, DemoChatState } from "./state/FullState";
import { theme } from "./Themes/theme";
import { WithTitle } from './layouts/WithTitle';
import { DisplayGui } from "./gui/gui";
import { processSideEffectsInState } from "./state/state2Sideeffects";
import { Lenses } from "@focuson/lens";
import { processSideEffect, sendMessageSideeffectProcessor } from "./sideeffects/sideeffects";
import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiLoading, ApiLoading, apiLoadingFromBrowser, MessageSave, messageSaving } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, defaultProcessors, NoIdStore, processEvents } from "@intellimaintain/events";


export type AppProps<S> = LensProps<S, DemoChatState, any>
function App<S> ( { state }: AppProps<S> ) {
  return <ThemeProvider theme={theme}>

    <Box sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
      <TwoColumnLayout>
        <WithTitle title='Operator'><DisplayGui from='Operator' to='Wizard' label='display Operator' state={state.focusOn ( 'chatState1' )}/></WithTitle>
        <WithTitle title='Wizard of Oz'><DisplayGui from='Wizard' to='Operator' label='display Wizard' state={state.focusOn ( 'chatState2' )}/></WithTitle>
      </TwoColumnLayout>
    </Box>
  </ThemeProvider>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

let ticket = { number: 'Ticket PA123', description: 'Delete project P-6666' };
let ka = {
  title: 'Delete Project', body: `1
  2
  3
  4
  5
  6
  7
  8
  9
  10
  11
     12`
};
const startAppState: DemoChatState = {
  chatState1: blankChatState ( 'Operator', 'Wizard', ka, ticket ),
  chatState2: blankChatState ( 'Wizard', 'Operator', ka, ticket )
}

let context: DI = {
  sendMessage: ( message: string ) => console.log ( 'send message', message ),
  sendMail: ( message: string ) => console.log ( 'send mail', message )
};

const container = eventStore<DemoChatState> ()
const setJson = setEventStoreValue ( container );
const sep1 = defaultEventProcessor<DemoChatState> ( 'chatState1.', startAppState, NoIdStore )
const sep2 = defaultEventProcessor<DemoChatState> ( 'chatState2.', startAppState, NoIdStore )

addEventStoreListener ( container, (( oldS, s, setJson ) => root.render ( <App state={lensState ( s, setJson, 'Container', {} )}/> )) );

const idL = Lenses.identity<DemoChatState> ()
const chatState1L = idL.focusOn ( 'chatState1' )
const sideEffects1L = chatState1L.focusOn ( 'sideeffects' )
const logs1L = chatState1L.focusOn ( 'log' )
const chatState2L = idL.focusOn ( 'chatState2' )
const sideEffects2L = chatState2L.focusOn ( 'sideeffects' )
const logs2L = chatState2L.focusOn ( 'log' )

const pollingDetails = polling ( 1000, async s => {
  console.log ( 'polling', typeof s, s )
  const events = stringToEvents ( {}, s );
  console.log ( 'events', events )
  const { state: state1, errors: errors1 } = await processEvents ( sep1, container.state, events )
  const { state: state2, errors: errors2 } = await processEvents ( sep2, state1 || container.state, events )
  const errors = [ ...errors1, ...errors2 ]
  console.log ( 'errors', errors )
  const state = state2 || state1 || container.state
  console.log ( 'state', state )
  if ( state )
    setJson ( state )
} )
const apiDetails: ApiLoading = apiLoading ( "http://localhost:1235/file1" )
const saveDetails: MessageSave = messageSaving ( "http://localhost:1235/file1" )
startPolling ( pollingDetails, apiLoadingFromBrowser ( apiDetails ) )

addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ sendMessageSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects1L, logs1L ) )
addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ sendMessageSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects2L, logs2L ) )


setJson ( startAppState )