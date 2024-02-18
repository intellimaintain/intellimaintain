import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { LensProps2 } from "@focuson/state";
import { Conversation } from "./conversation";

import { UserTypingBox } from "./userTypingBox";
import { SideEffect } from "../sideeffects/sideeffects";


export interface ChatProps<S, C> extends LensProps2<S, Conversation, SideEffect[], C> {

}
export function DisplayConversation<S, C> ( { state }: ChatProps<S, C> ) {
  const conversation: Conversation = state.json1 ()
  const { chatResponses, chatter, responder } = conversation
  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom>Chat</Typography>
      <List>
        {chatResponses.map ( ( message, index ) => (
          <ListItem key={index}>
            <Typography variant="subtitle1" color="textSecondary">
              {message.from}: {message.message}
            </Typography>
          </ListItem>
        ) )}
      </List>
      <UserTypingBox state={state.focus1On ( 'message' )}/>
    </Box>
  );
};
