import React from 'react';
import ReactDOM from 'react-dom/client';
import { lensState } from "@focuson/state";

import { addEventStoreListener, addEventStoreModifier, eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { apiIdStore, apiLoading, ApiLoading, apiLoadingFromBrowser, idStoreFromApi, listidsFromFetch, sendEvents, SendEvents, } from "@intellimaintain/apiclienteventstore";
import { defaultEventProcessor, processEvents } from "@intellimaintain/events";

import { eventSideeffectProcessor, processSideEffect, processSideEffectsInState } from '@intellimaintain/react_core';
import { TemplateFn } from '@intellimaintain/components';
import { IdStore } from "@intellimaintain/idstore";
import { ListIds } from "@intellimaintain/listids";
import { App } from './gui/app';
import { defaultVariablesExtractor, extractVariablesForAllDomain, InitialLoadResult, loadInitialIds } from "@intellimaintain/defaultdomains";
import { ItsmState, logsL, sideEffectsL, startAppState } from "./state/itsm.state";


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

const container = eventStore<ItsmState> ()
const setJson = setEventStoreValue ( container );
const sep1 = defaultEventProcessor<ItsmState> ( '', startAppState, idStore )

addEventStoreListener ( container, (( oldS, s, setJson ) =>
  root.render ( <App state={lensState ( s, setJson, 'Container', {} )}/> )) );

const pollingDetails = polling ( 1000, async s => {
  console.log ( 'polling', typeof s, s )
  const events = stringToEvents ( {}, s );
  console.log ( 'events', events )
  const { state: state, errors } = await processEvents ( sep1, container.state, events )
  console.log ( 'errors', errors )
  console.log ( 'state', state )
  if ( state ) {
    const result = extractVariablesForAllDomain ( defaultVariablesExtractor,
      { name: 'Phil', email: 'phil@example.com' },
      state.tickets, state.kas, state.scs )
    const newState = { ...state, variables: result }
    console.log ( 'result with variables', result )
    setJson ( newState )
  }
} )


addEventStoreModifier ( container,
  processSideEffectsInState<ItsmState> (
    processSideEffect ( [ eventSideeffectProcessor ( saveDetails, 'conversation.messages' ) ] ),
    sideEffectsL, logsL ) )

loadInitialIds ( listIds ).then ( ( res: InitialLoadResult ) => {
  const newState = { ...startAppState, ...res }
  setJson ( newState )
  startPolling ( pollingDetails, apiLoadingFromBrowser ( apiDetails ) )
} )
