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
import { eventSideeffectProcessor, processSideEffect } from "./sideeffects/sideeffects";
import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiIdStore, apiLoading, ApiLoading, apiLoadingFromBrowser, idStoreFromApi, sendEvents, SendEvents, } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, processEvents } from "@intellimaintain/events";
import { ChatState, DemoChatState } from "./domain/domain";
import { startAppState } from "./domain/sample";
import { Variables } from "@intellimaintain/variables";
import { extractVariablesFromSelectedAndList } from "./domain/variables/variables";
import { defaultVariablesExtractor } from "@intellimaintain/domainvariables";
import { NameAnd } from "@laoban/utils";


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

const apiDetails: ApiLoading = apiLoading ( "http://localhost:1235/file1" )
const saveDetails: SendEvents = sendEvents ( "http://localhost:1235/file1" )
const idStoreDetails = apiIdStore ( "http://localhost:1235" )
const idStore = idStoreFromApi ( idStoreDetails )

const container = eventStore<DemoChatState> ()
const setJson = setEventStoreValue ( container );
const sep1 = defaultEventProcessor<DemoChatState> ( 'chatState1.', startAppState, idStore )
const sep2 = defaultEventProcessor<DemoChatState> ( 'chatState2.', startAppState, idStore )

addEventStoreListener ( container, (( oldS, s, setJson ) => root.render ( <App state={lensState ( s, setJson, 'Container', {} )}/> )) );

const idL = Lenses.identity<DemoChatState> ()
const chatState1L = idL.focusOn ( 'chatState1' )
const sideEffects1L = chatState1L.focusOn ( 'sideeffects' )
const logs1L = chatState1L.focusOn ( 'log' )

const chatState2L = idL.focusOn ( 'chatState2' )
const sideEffects2L = chatState2L.focusOn ( 'sideeffects' )
const logs2L = chatState2L.focusOn ( 'log' )

export function extractVariablesAndAddToState ( chat: ChatState ) {
  const ve = defaultVariablesExtractor
  const variables: NameAnd<Variables> = {
    Ticket: extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.tickets ),
    'Knowledge Article': extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.kas ),
    'Software Catalog': extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', chat.scs )
  }
  return { ...chat, variables}
}
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
  if ( state ) {
    const result: DemoChatState = { ...state, chatState1: extractVariablesAndAddToState ( state.chatState1 ), chatState2: extractVariablesAndAddToState ( state.chatState2 ) }
    console.log ( 'result with variables', result )
    setJson ( result )
  }
} )


startPolling ( pollingDetails, apiLoadingFromBrowser ( apiDetails ) )

addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects1L, logs1L ) )
addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects2L, logs2L ) )


setJson ( startAppState )