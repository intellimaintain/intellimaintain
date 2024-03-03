import { LensProps } from "@focuson/state";
import { ThemeProvider, Toolbar } from "@mui/material";
import { ColumnLeftMainBottom, DisplayDebug, SilentTabsContainer, SimpleTabPanel, theme } from "@intellimaintain/components";
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
      <SilentTabsContainer state={state.focusOn ( 'selectionState' ).focusOn ( 'workspaceTab' )}>
        <SimpleTabPanel title='chat'><ConversationHistoryAndChat state={convState}
                                                                 plugins={plugins}/></SimpleTabPanel>
        <SimpleTabPanel title='settings'>
          <div><Toolbar/>
            Settings go here
          </div>
        </SimpleTabPanel>
      </SilentTabsContainer>
      {showDevMode && <DisplayDebug state={state}/>}
    </ColumnLeftMainBottom>
  </ThemeProvider>
  </>
}
