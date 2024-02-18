import React from 'react';
import ReactDOM from 'react-dom/client';
import { LensProps, setJsonForFlux } from "@focuson/state";
import { TwoColumnLayout } from "./layouts/TwoColumnLayout";
import { Paper, ThemeProvider, Typography } from "@mui/material";
import { DI } from "./DI/DI";
import { DemoChatState } from "./state/FullState";
import { theme } from "./Themes/theme";
import Grid from "@mui/material/Grid";
import { WithTitle } from './layouts/WithTitle';
import { DisplayGui } from "./gui/gui";


export type AppProps<S> = LensProps<S, DemoChatState, any>
function App<S> ( { state }: AppProps<S> ) {
  return <ThemeProvider theme={theme}>
    <Typography variant="h4" component="h1" gutterBottom>
      Chat Bot Demo
    </Typography>
    <TwoColumnLayout>
      <WithTitle title='Operator'><DisplayGui label='display Operator' state={state.focusOn ( 'chatState1' )}/></WithTitle>
      <WithTitle title='Wizad of Oz'><DisplayGui label='display Wizard' state={state.focusOn ( 'chatState2' )}/></WithTitle>
    </TwoColumnLayout>
  </ThemeProvider>
}

const rootElement = document.getElementById ( 'root' );
if ( !rootElement ) throw new Error ( 'Failed to find the root element' );
const root = ReactDOM.createRoot ( rootElement );

const startAppState: DemoChatState = {
  chatState1: {
    selectionState: {},
    conversation: { chatter: 'Operator', responder: 'Wizard', chatResponses: [ { chat: 'q1', response: 'a1' }, { chat: 'q2', response: 'a2' } ] },
    sql: [],
    ka: {
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
    }
  },
  chatState2: {
    selectionState: {},
    conversation: { chatter: 'Wizard', responder: 'Operator', chatResponses: [ { chat: 'q3', response: 'a3' } ] },
    sql: [],
    ka: { title: 'Delete Project', body: '' }
  }
}

let context: DI = {
  sendMessage: ( message: string ) => console.log ( 'send message', message ),
  sendMail: ( message: string ) => console.log ( 'send mail', message )
};
let setJson = setJsonForFlux<DemoChatState, void, DI> ( 'counter', context, s =>
  root.render ( <App state={s}/> ) );

setJson ( startAppState )