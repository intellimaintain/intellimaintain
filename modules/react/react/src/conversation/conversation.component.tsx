import React from 'react';
import { List, ListItem, Typography } from '@mui/material';
import { LensProps } from "@focuson/state";
import { Conversation } from "./conversation";
import { HasSendMessage } from "../DI/DI";
import { UserTypingBox } from "./userTypingBox";


export interface ChatProps<S, C extends HasSendMessage> extends LensProps<S, Conversation, C> {

}
export function DisplayConversation<S, C extends HasSendMessage> ( { state }: ChatProps<S, C> ) {
  const conversation: Conversation = state.json ()
  const { chatResponses, chatter, responder } = conversation
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
      <UserTypingBox state={state.focusOn ( 'message' )}/>
    </>
  );
};
