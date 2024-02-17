import React from 'react';
import ReactDOM from 'react-dom/client';
import { LensProps, setJsonForFlux } from "@focuson/state";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { Typography } from "@mui/material";
import { Conversation } from "./domain/messages";
import { ChatInterface } from "./domain/message.component";
import { WithTitle } from "./layouts/WithTitle";

export type AppState = {
  conversation1: Conversation
  conversation2: Conversation
}
export type AppProps<S> = LensProps<S, AppState, any>
function App<S> ( { state }: AppProps<S> ) {
  return <div style={{ padding: 20 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Chat Bot Demo
    </Typography>
    <TwoColumnLayout>
      <WithTitle title='Operator'><ChatInterface state={state.focusOn ( 'conversation1' )}/></WithTitle>
      <WithTitle title='Wizard of Oz'><ChatInterface state={state.focusOn ( 'conversation2' )}/></WithTitle>
    </TwoColumnLayout>
  </div>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

const startAppState: AppState = {
  conversation1: { chatter: 'Operator', responder: 'Wizard', chatResponses: [ { chat: 'q1', response: 'a1' },{ chat: 'q2', response: 'a2' } ] },
  conversation2: { chatter: 'Wizard', responder: 'Operator', chatResponses: [ { chat: 'q3', response: 'a3' } ] },
}

let setJson = setJsonForFlux<AppState, void, any> ( 'counter', {}, s =>
  root.render ( <App state={s}/> ) );

setJson ( startAppState )