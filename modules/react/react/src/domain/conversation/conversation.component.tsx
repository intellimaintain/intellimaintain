import React, { useEffect, useRef } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { LensProps2 } from "@focuson/state";
import { UserTypingBox } from "./userTypingBox";
import { Conversation } from "@intellimaintain/domain";
import { SideEffect } from "../../sideeffects/sideeffects";


export interface ChatProps<S, C> extends LensProps2<S, Conversation, SideEffect[], C> {
  from: string

}
export function DisplayConversation<S, C> ( { state, from }: ChatProps<S, C> ) {
  const conversation: Conversation = state.json1 ()
  const { messages, chatter, responder } = conversation
  const endOfListRef = useRef(null);

  useEffect(() => {
    console.log('scrolling to end', endOfListRef.current);
    const parent = (endOfListRef?.current as any)?.parentElement
    if (parent) {
      const listElement = parent
      const scrollHeight = listElement.scrollHeight;
      const height = listElement.clientHeight;
      const maxScrollTop = scrollHeight - height;
      listElement.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [messages]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '45vh' }}>
      <Typography variant="h2" component="h2" gutterBottom>Chat</Typography>
      <List sx={{ maxHeight: '30vh', overflowY: 'auto' ,
        border: '1px solid #ccc',
        padding: '8px',
        marginRight: '48px',
        fontFamily: 'monospace',
      }}>
        {messages.map ( ( message, index ) => (
          <ListItem key={index}>
            <Typography variant="subtitle1" color="textSecondary">
              {message.who}: {message.message}
            </Typography>
          </ListItem>
        ) )}
      </List>
      <div ref={endOfListRef}/>
      <UserTypingBox from={from} state={state.focus1On ( 'message' )}/>
    </Box>
  );
};
