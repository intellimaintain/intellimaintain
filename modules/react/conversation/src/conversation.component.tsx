import React, { useEffect, useRef } from 'react';
import { Box, Grid, List, ListItem, Typography } from '@mui/material';
import { LensProps2, LensProps3, LensState2, LensState3 } from "@focuson/state";
import { UserTypingBox } from "./userTypingBox";
import { Conversation } from "@intellimaintain/domain";
import { SideEffect } from '@intellimaintain/react_core';
import { displayMessage, DisplayMessagePlugin, TemplateFn } from '@intellimaintain/components';
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { Lenses } from "@focuson/lens";
import { ChatButtons } from "./chatbuttons/chatbuttons";

export interface HasDisplayPlugins {
  displayPlugins: DisplayMessagePlugin[]
}


export interface ConversationProps<S, C extends HasDisplayPlugins> extends LensProps3<S, Conversation, NameAnd<Variables>, SideEffect[], C> {
  from: string
  path: string
  template: TemplateFn<S>
  children?: React.ReactNode
}
export function DisplayConversation<S, C extends HasDisplayPlugins> ( { state, from, path, children, template }: ConversationProps<S, C> ) {
  const conversation: Conversation = state.json1 ()
  const plugins = state.context.displayPlugins
  const { messages, chatter } = conversation
  const endOfListRef = useRef ( null );
  const variables = state.json2 ()
  const summary = variables[ 'Summary' ]?.variables || {}
  useEffect ( () => {
    console.log ( 'scrolling to end', endOfListRef.current );
    const parent = (endOfListRef?.current as any)?.parentElement
    if ( parent ) {
      const listElement = parent
      const scrollHeight = listElement.scrollHeight;
      const height = listElement.clientHeight;
      const maxScrollTop = scrollHeight - height;
      listElement.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [ messages ] );
  return (
    <>
    <Typography variant="h2" component="h2" gutterBottom>ITSM Workbench</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '90vh', border: '1px solid #ccc' }}>
      {children}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{
          padding: '8px',
          marginRight: '48px',
        }}>
          {messages.map ( ( message, index ) => (
            <ListItem key={index}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {message.who}:
                  </Typography>
                </Grid>
                <Grid item xs={10}>{displayMessage ( plugins, summary, from, path + `message[${index}].`, state.state13 ().focus1On ( 'messages' ).chain1 ( Lenses.nth ( index ) ), template )}</Grid>
              </Grid>
            </ListItem>
          ) )}
        </List>
        <div ref={endOfListRef}/>
      </Box>
    </Box></>
  )
    ;
}
