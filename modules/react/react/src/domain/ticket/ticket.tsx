import React from 'react';
import { LensProps, LensProps2 } from "@focuson/state";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { IdAndName, SelectedAndList } from "../domain";
import { DropdownAsTitle } from "../../layouts/DropdownAsTitle";
import { SideEffect } from "../../sideeffects/sideeffects";

export type Tickets = SelectedAndList<Ticket>
export interface Ticket extends IdAndName {
  priority: string
  description: string
}
export function DisplayTicket<S> ( { state }: LensProps<S, Ticket, any> ) {
  let ticket: Ticket | undefined = state.optJson ()
  return <Box mt={2}>
    <Typography variant="subtitle1" color="textSecondary">Priority: {ticket?.priority}</Typography>
    <ReactMarkdown>{ticket?.description || ''}</ReactMarkdown>
  </Box>
}
export function DisplayTickets<S> ( { state }: LensProps2<S, Tickets, SideEffect[], any> ) {
  return <DropdownAsTitle state={state} purpose='Ticket'>{
    state => <DisplayTicket state={state}/>
  }</DropdownAsTitle>
}