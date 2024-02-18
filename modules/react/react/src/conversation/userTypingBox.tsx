import React, { useRef } from 'react';
import { TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { HasSendMessage } from "../DI/DI";
import { LensProps } from "@focuson/state";

export function UserTypingBox<S, C extends HasSendMessage> ( { state }: LensProps<S, string, C> ) {
  const inputRef = useRef<HTMLTextAreaElement> ( null );
  function sendMessage () {
    if ( inputRef.current ) {
      const message = inputRef.current.value.trim ();
      state.context.sendMessage ( message )
      state.setJson ( '', 'sent message' )
      inputRef.current.value = '';
    }
  }
  function handleBlur () {
    if ( inputRef.current ) {
      const message = inputRef.current.value;
      state.setJson ( message, 'chat changed' );
    }
  }
  const handleKeyPress = ( event: React.KeyboardEvent<HTMLDivElement> ) => {
    if ( (event.ctrlKey || event.shiftKey) && event.key === 'Enter' ) {
      event.preventDefault (); // Prevent default to avoid adding a new line on Ctrl+Enter or Shift+Enter
      sendMessage ();
    }
  };

  console.log ( 'render', state.optJson () )
  return (
    <div>
      <TextField
        multiline
        variant="outlined"
        placeholder="Type a message..."
        inputRef={inputRef} // Use ref to access the input for sending message
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        defaultValue={state.optJson () || ''}
        fullWidth
      />
      <IconButton color="primary" onClick={sendMessage}>
        <SendIcon/>
      </IconButton>
    </div>
  );
}
