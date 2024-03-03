import { LensProps } from "@focuson/state";
import { ThemeProvider } from "@mui/material";
import { ColumnLeftMainBottom, DisplayDebug, theme } from "@intellimaintain/components";
import React from "react";
import { CommonState } from "@intellimaintain/react_core";
import { ItsmState } from "../state/itsm.state";
import { ConversationHistoryAndChat, ConversationPlugin } from "@intellimaintain/react_conversation";
import { GuiNav } from "./gui.nav";

export interface AppProps<S, CS extends CommonState> extends LensProps<S, CS, any> {
  plugins: ConversationPlugin<S>[]
}

export function App<S> ( { state, plugins }: AppProps<S, ItsmState> ) {
  let showDevMode = state.optJson ()?.debug?.showDevMode;
  console.log ( 'state', state.optJson () );
  const convState = state.doubleUp ().focus1On ( 'conversation' ).focus2On ( 'sideeffects' )
  return <>
    return <ThemeProvider theme={theme}>
    <ColumnLeftMainBottom title='ITSM Workbench'
                          layout={{ drawerWidth: '240px', height: '100vh' }}
                          state={state.focusOn ( "selectionState" ).focusOn ( 'mainScreen' )}
                          Nav={<GuiNav state={state}/>}>
      <ConversationHistoryAndChat state={convState}
                                  plugins={plugins}
                                  devMode={showDevMode && <DisplayDebug state={state} maxWidth='95vw'/>}/>
    </ColumnLeftMainBottom>
  </ThemeProvider>
  </>
}
