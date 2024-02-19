import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { LensProps2 } from "@focuson/state";


import { UserTypingBox } from "./userTypingBox";
import { SideEffect } from "../sideeffects/sideeffects";
import { Conversation } from "@intellimaintain/apiclienteventstore";


export interface ChatProps<S, C> extends LensProps2<S, Conversation, SideEffect[], C> {
  from: string
  to: string

}
export function DisplayConversation<S, C> ( { state, from, to }: ChatProps<S, C> ) {
  const conversation: Conversation = state.json1 ()
  const { messages, chatter, responder } = conversation
  return (
    <Box>
      <Typography variant="h2" component="h2" gutterBottom>Chat</Typography>
      <List>
        {messages.map ( ( message, index ) => (
          <ListItem key={index}>
            <Typography variant="subtitle1" color="textSecondary">
              {message.from}: {message.message}
            </Typography>
          </ListItem>
        ) )}
      </List>
      <UserTypingBox from={from} to={to} state={state.focus1On ( 'message' )}/>
    </Box>
  );
};
