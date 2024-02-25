import React from 'react';
import ReactDOM from 'react-dom/client';
import { LensProps, LensState, lensState, LensState2 } from "@focuson/state";
import { ThemeProvider } from "@mui/material";

import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiIdStore, apiLoading, ApiLoading, apiLoadingFromBrowser, idStoreFromApi, listidsFromFetch, sendEvents, SendEvents, } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, processEvents } from "@intellimaintain/events";
import { ChatState, DemoChatState, logs1L, logs2L, sideEffects1L, sideEffects2L } from "./domain/domain";
import { startAppState } from "./domain/sample";
import { eventSideeffectProcessor, processSideEffect, processSideEffectsInState } from '@intellimaintain/react_core';
import { TemplateFn, theme, TwoColumnLayout } from '@intellimaintain/components';
import { IdStore } from "@intellimaintain/idstore";
import { DisplayGui } from './gui/gui';
import { extractVariablesAndAddToState } from "./variables/variables";
import { DI } from "./di/di";
import { ChatEntryWorkspace, checkSqlDisplayMessagePlugin, dereferencePlugIn, emailDisplayPlugin, EmailWorkspace, LdapWorkspace, QuickData, QuickWorkspace, resolveSqlDisplayMessagePlugin, sqlDataDisplayMessagePlugin, SqlWorkspace } from '@intellimaintain/react_conversation';
import { ListIds } from "@intellimaintain/listids";

const templateFn = <K extends keyof DemoChatState> ( offset: K ): TemplateFn<any> => ( state, templateName ) => {
  //this is a terrible hack just to see what the gui looks like
  return state?.[ offset ]?.templates?.item?.template || ''
}
export type AppProps<S> = LensProps<S, DemoChatState, DI<S>>
function App<S> ( { state }: AppProps<S> ) {
  return <ThemeProvider theme={theme}>
    <TwoColumnLayout>
      <DisplayGui from='Operator' tabsHeight='45vh' path='chatState1.' template={templateFn ( 'chatState1' )} state={state.focusOn ( 'chatState1' )}/>
      <DisplayGui from='Wizard' tabsHeight='45vh' path='chatState2.' template={templateFn ( 'chatState1' )} state={state.focusOn ( 'chatState2' )}/>
    </TwoColumnLayout>
  </ThemeProvider>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

const apiDetails: ApiLoading = apiLoading ( "http://localhost:1235/file1" )
const saveDetails: SendEvents = sendEvents ( "http://localhost:1235/file1" )
const idStoreDetails = apiIdStore ( "http://localhost:1235" )
const idStore: IdStore = idStoreFromApi ( idStoreDetails )
const listIds: ListIds = listidsFromFetch ( idStoreDetails )

const container = eventStore<DemoChatState> ()
const setJson = setEventStoreValue ( container );
const sep1 = defaultEventProcessor<DemoChatState> ( 'chatState1.', startAppState, idStore )
const sep2 = defaultEventProcessor<DemoChatState> ( 'chatState2.', startAppState, idStore )

const di: DI<ChatState> = {
  displayPlugins: [ checkSqlDisplayMessagePlugin,
    resolveSqlDisplayMessagePlugin, emailDisplayPlugin, dereferencePlugIn,
    sqlDataDisplayMessagePlugin ],
  defaultPlugin:
    QuickWorkspace<ChatState> ( ( s: LensState<any, ChatState, any> ): QuickData<ChatState> => {
      const state = s.doubleUp ().focus1On ( 'variables' ).focus2On ( 'sideeffects' )
      const knowledgeArticle = s.focusOn ( 'kas' ).optJson ()?.item
      const ticket = s.focusOn ( 'tickets' ).optJson ()?.item
      let qd = { state, knowledgeArticle, ticket };
      console.log('qd', qd)
      return qd
    } ),
  workspacePlugins: [
    ChatEntryWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'chatTempSpace' ).focus2On ( 'sideeffects' ) ),
    SqlWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'sqlTempSpace' ).focus2On ( 'sideeffects' ) ),
    LdapWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'ldapTempSpace' ).focus2On ( 'sideeffects' ) ),
    EmailWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'emailTempSpace' ).focus2On ( 'sideeffects' ) ),
  ]

}
addEventStoreListener ( container, (( oldS, s, setJson ) =>
  root.render ( <App state={lensState ( s, setJson, 'Container', di )}/> )) );

//pretty nasty... mutates the state... but we do it before we start
async function loadInitialIds ( s: DemoChatState ) {
  const kaIds = await listIds ( 'ka' )
  console.log ( 'kaIds', kaIds )
  const scIds = await listIds ( 'sc' )
  console.log ( 'scIds', scIds )
  const ticketIds = await listIds ( 'ticket' )
  console.log ( 'ticketIds', ticketIds )
  const templateIds = await listIds ( 'template' )
  console.log ( 'template', templateIds )

  s.chatState1.kas.options = kaIds.map ( k => ({ id: k, name: k }) )
  s.chatState1.scs.options = scIds.map ( k => ({ id: k, name: k }) )
  s.chatState1.tickets.options = ticketIds.map ( k => ({ id: k, name: k }) )
  s.chatState1.templates.options = templateIds.map ( k => ({ id: k, name: k }) )

  s.chatState2.kas.options = kaIds.map ( k => ({ id: k, name: k }) )
  s.chatState2.scs.options = scIds.map ( k => ({ id: k, name: k }) )
  s.chatState2.tickets.options = ticketIds.map ( k => ({ id: k, name: k }) )
  s.chatState2.templates.options = templateIds.map ( k => ({ id: k, name: k }) )
  console.log ( 's', s )
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


addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects1L, logs1L ) )
addEventStoreModifier ( container, processSideEffectsInState<DemoChatState> ( processSideEffect (
  [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffects2L, logs2L ) )

loadInitialIds ( startAppState ).then ( () => {
  startPolling ( pollingDetails, apiLoadingFromBrowser ( apiDetails ) )
  setJson ( startAppState )
} )