import { LensProps } from "@focuson/state";
import { ItsmState } from "../state/itsm.state";
import { FocusOnSetStringButton, FocusOnToggleButton } from "@intellimaintain/components";
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import SettingsIcon from '@mui/icons-material/Settings';
import React from "react";
import { Box } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';

export function GuiNav<S> ( { state }: LensProps<S, ItsmState, any> ) {
  const buttonSx = {
    justifyContent: 'flex-start',
    textAlign: 'left',
    width: '100%',
  };

  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2, // Adjust the gap size to your preference
      p: 1, // Adds padding around the entire container
    }}
  >
    <div>Settings/tickets</div>
    <FocusOnSetStringButton aria-label='Resolve Tickets' startIcon={<ChatIcon/>} value='chat' state={state.focusOn ( 'selectionState' ).focusOn ( 'workspaceTab' )} sx={buttonSx}>Resolve Tickets</FocusOnSetStringButton>
    <FocusOnSetStringButton aria-label='Show settings' startIcon={<SettingsIcon/>} value='settings' state={state.focusOn ( 'selectionState' ).focusOn ( 'workspaceTab' )} sx={buttonSx}>Settings</FocusOnSetStringButton>
    <FocusOnToggleButton aria-label='Toggle Developer Mode' startIcon={<DeveloperModeIcon/>} state={state.focusOn ( 'debug' ).focusOn ( 'showDevMode' )} sx={buttonSx}>Developer Mode</FocusOnToggleButton>
  </Box>
}