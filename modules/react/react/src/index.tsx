import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chat, ChatState } from "./chat/chat";
import { LensProps, lensState, setJsonForFlux } from "@focuson/state";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { Typography } from "@mui/material";

export type AppState = {
  chat1: ChatState
  chat2: ChatState
}
export type AppProps<S> = LensProps<S, AppState, any>
function App<S> ( { state }: AppProps<S> ) {
  return <div style={{ padding: 20 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Chat Bot Demo
    </Typography>
    <TwoColumnLayout>
      <Chat title="Chat" state={state.focusOn ( 'chat1' )}/>
      <Chat title="Chat" state={state.focusOn ( 'chat2' )}/>
    </TwoColumnLayout>
  </div>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

const startAppState: AppState = {
  chat1: { msg: [ 'msg1', 'msg2' ] },
  chat2: { msg: [ 'msg3' ] }
}

let setJson = setJsonForFlux<AppState, void, any> ( 'counter', {}, s =>
  root.render ( <App state={s}/> ) );

setJson ( startAppState )