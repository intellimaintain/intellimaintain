import React, { useRef } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { LensProps2 } from "@focuson/state";
import { SideEffect } from "../sideeffects/sideeffects";

interface UserTypingBoxProps<S, C> extends LensProps2<S, string, SideEffect[], C> {
  from: string
  to: string
}

export function UserTypingBox<S, C> ( { state, from, to }: UserTypingBoxProps<S, C> ) {
  const inputRef = useRef<HTMLTextAreaElement> ( null );
  function sendMessage () {
    if ( inputRef.current ) {
      const message = inputRef.current.value.trim ();
      state.transformJson (
        msg => '',
        old => [ ...(old || []), { command: 'sendMessage', message: { message, from, to } } ],
        'sent message' );
      inputRef.current.value = '';
    }
  }
  function handleBlur () {
    if ( inputRef.current ) {
      const message = inputRef.current.value;
      state.state1 ().setJson ( message, 'chat changed' );
    }
  }
  const handleKeyPress = ( event: React.KeyboardEvent<HTMLDivElement> ) => {
    if ( (event.ctrlKey || event.shiftKey) && event.key === 'Enter' ) {
      event.preventDefault (); // Prevent default to avoid adding a new line on Ctrl+Enter or Shift+Enter
      sendMessage ();
    }
  };

  return (
    <Box sx={{
      display: 'flex', // Enables flex container
      alignItems: 'center', // Vertically centers the items
      gap: 1, // Adds a gap between items
    }}>
      <TextField
        multiline
        variant="outlined"
        placeholder="Type a message..."
        inputRef={inputRef} // Use ref to access the input for sending message
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        defaultValue={state.optJson1 () || ''}
        fullWidth
      />
      <IconButton color="primary" onClick={sendMessage}>
        <SendIcon/>
      </IconButton>
    </Box>
  );
}
