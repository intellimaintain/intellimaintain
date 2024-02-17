import React from 'react';
import { IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import { LensProps } from "@focuson/state";
import { Conversation } from "./messages";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";

export function ChatBox<S> ( { state }: LensProps<S, string, any> ) {
  const message = state.optJson () || ''

  function handleMessageChange ( event: React.ChangeEvent<HTMLInputElement> ) {
    state.setJson ( event.target.value, 'chat changed' );
  }
  function handleSend () {
    if ( message.trim () ) {
      console.log ( 'would set chat', message.trim () );
      state.setJson ( '', 'sent message' ); // Clear the input after sending
    }
  }
  function handleKeyPress ( event: React.KeyboardEvent<HTMLDivElement> ) {
    if ( event.key === 'Enter' ) {
      event.preventDefault (); // Prevent default to avoid newline on enter
      if ( event.shiftKey || event.ctrlKey ) handleSend (); else state.setJson ( message + '\n', 'chat changed' );
    }
  }
  return (
    <Paper component="form" sx={{ display: 'flex', alignItems: 'center', padding: '10px' }} onSubmit={( e ) => e.preventDefault ()}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyPress}
        variant="outlined"
        placeholder="Type a message..."
        sx={{ marginRight: '10px' }}
      />
      <IconButton type="submit" onClick={handleSend} color="primary">
        <SendIcon/>
      </IconButton>
    </Paper>
  );
}

export interface ChatProps<S> extends LensProps<S, Conversation, any> {

}
export function ChatInterface<S> ( { state }: ChatProps<S> ) {
  const { chatResponses, chatter, responder } = state.json ()
  return (
    <>
      <List>
        {chatResponses.map ( ( pair, index ) => (
          <React.Fragment key={index}>
            <ListItem>
              <Typography variant="subtitle1" color="textSecondary">
                {chatter}: {pair.chat}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle1">
                {responder}: {pair.response}
              </Typography>
            </ListItem>
          </React.Fragment>
        ) )}
      </List>
      <ChatBox state={state.focusOn ( 'message' )}/>
    </>
  );
};
