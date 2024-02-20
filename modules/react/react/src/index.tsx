import React from 'react';
import ReactDOM from 'react-dom/client';
import { LensProps, lensState } from "@focuson/state";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { Box, ThemeProvider } from "@mui/material";
import { theme } from "./Themes/theme";
import { WithTitle } from './layouts/WithTitle';
import { DisplayGui } from "./gui/gui";
import { processSideEffectsInState } from "./state/state2Sideeffects";
import { Lenses } from "@focuson/lens";
import { processSideEffect, sendMessageSideeffectProcessor } from "./sideeffects/sideeffects";
import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiLoading, ApiLoading, apiLoadingFromBrowser, MessageSave, messageSaving } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, processEvents } from "@intellimaintain/events";
import { DemoChatState } from "./domain/domain";
import { startAppState } from "./domain/sample";
import { NoIdStore } from "@intellimaintain/idstore";


export type AppProps<S> = LensProps<S, DemoChatState, any>
function App<S> ( { state }: AppProps<S> ) {
  return <ThemeProvider theme={theme}>

    <Box sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
      <TwoColumnLayout>
        <WithTitle title='Operator'><DisplayGui from='Operator' label='display Operator' state={state.focusOn ( 'chatState1' )}/></WithTitle>
        <WithTitle title='Wizard of Oz'><DisplayGui from='Wizard' label='display Wizard' state={state.focusOn ( 'chatState2' )}/></WithTitle>
      </TwoColumnLayout>
    </Box>
  </ThemeProvider>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );


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