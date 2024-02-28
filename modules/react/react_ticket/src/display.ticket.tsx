import React from 'react';
import { LensProps, LensProps2 } from "@focuson/state";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { DropdownAsTitle } from "@intellimaintain/components";
import { SideEffect } from "@intellimaintain/react_core";
import { Ticket, Tickets } from "@intellimaintain/tickets";


export function DisplayTicket<S> ( { state }: LensProps<S, Ticket, any> ) {
  let ticket: Ticket | undefined = state.optJson ()
  return <Box mt={2}>
    <Typography variant="subtitle1" color="textSecondary">Severity: {ticket?.severity}</Typography>
    <ReactMarkdown>{ticket?.description || ''}</ReactMarkdown>
  </Box>
}
export function DisplayTickets<S> ( { state, path }: LensProps2<S, Tickets, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle state={state} purpose='Ticket' path={path} parser='ticket'>{
    state => <DisplayTicket state={state}/>
  }</DropdownAsTitle>
}