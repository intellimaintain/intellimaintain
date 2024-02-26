import React from 'react';
import ReactDOM from 'react-dom/client';
import { lensState } from "@focuson/state";

import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiIdStore, apiLoading, ApiLoading, apiLoadingFromBrowser, idStoreFromApi, listidsFromFetch, sendEvents, SendEvents, } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, processEvents } from "@intellimaintain/events";
import { startAppState } from "./domain/sample";
import { eventSideeffectProcessor, processSideEffect, processSideEffectsInState } from '@intellimaintain/react_core';
import { TemplateFn } from '@intellimaintain/components';
import { IdStore } from "@intellimaintain/idstore";
import { extractVariablesAndAddToState } from "./variables/variables";
import { ListIds } from "@intellimaintain/listids";
import { defaultDi } from './di/defaultDi';
import { loadInitialIds } from "./state/load.initial";
import { App } from './gui/app';
import { ChatState, logsL, sideEffectsL } from "./domain/domain";

const templateFn: TemplateFn<any> = ( state, templateName ) => {
  return state?.templates?.item?.template || ''
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

const apiDetails: ApiLoading = apiLoading ( "http://localhost:1235/file1" )
const saveDetails: SendEvents = sendEvents ( "http://localhost:1235/file1" )
const idStoreDetails = apiIdStore ( "http://localhost:1235" )
const idStore: IdStore = idStoreFromApi ( idStoreDetails )
const listIds: ListIds = listidsFromFetch ( idStoreDetails )

const container = eventStore<ChatState> ()
const setJson = setEventStoreValue ( container );
const sep1 = defaultEventProcessor<ChatState> ( '', startAppState, idStore )

addEventStoreListener ( container, (( oldS, s, setJson ) =>
  root.render ( <App state={lensState ( s, setJson, 'Container', defaultDi )} templateFn={templateFn}/> )) );

const pollingDetails = polling ( 1000, async s => {
  console.log ( 'polling', typeof s, s )
  const events = stringToEvents ( {}, s );
  console.log ( 'events', events )
  const { state: state, errors } = await processEvents ( sep1, container.state, events )
  console.log ( 'errors', errors )
  console.log ( 'state', state )
  if ( state ) {
    const result: ChatState = extractVariablesAndAddToState ( state )
    console.log ( 'result with variables', result )
    setJson ( result )
  }
} )


addEventStoreModifier ( container, processSideEffectsInState<ChatState> ( processSideEffect (
  [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ), sideEffectsL, logsL ) )

loadInitialIds ( listIds, startAppState ).then ( () => {
  startPolling ( pollingDetails, apiLoadingFromBrowser ( apiDetails ) )
  setJson ( startAppState )
} )