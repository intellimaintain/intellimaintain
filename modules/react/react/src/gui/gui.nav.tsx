import { LensProps } from "@focuson/state";
import { ItsmState } from "../state/itsm.state";
import { FocusOnSetValueButton, FocusOnToggleButton } from "@intellimaintain/components";
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
    <FocusOnSetValueButton aria-label='Resolve Tickets' startIcon={<ChatIcon/>} valueToSet='chat' state={state.focusOn ( 'selectionState' ).focusOn ( 'workspaceTab' )} sx={buttonSx}>Resolve Tickets</FocusOnSetValueButton>
    <FocusOnSetValueButton aria-label='Show settings' startIcon={<SettingsIcon/>} valueToSet='settings' state={state.focusOn ( 'selectionState' ).focusOn ( 'workspaceTab' )} sx={buttonSx}>Settings</FocusOnSetValueButton>
    <FocusOnToggleButton aria-label='Toggle Developer Mode' startIcon={<DeveloperModeIcon/>} state={state.focusOn ( 'debug' ).focusOn ( 'showDevMode' )} sx={buttonSx}>Developer Mode</FocusOnToggleButton>
  </Box>
}