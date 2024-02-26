import { LensProps2, LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { ChatButtons } from "../chatbuttons/chatbuttons";
import { Ticket } from "@intellimaintain/tickets";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { TicketStateDefinition } from "@intellimaintain/actions";


export interface QuickData<S> {
  state: LensState2<S, NameAnd<Variables>, SideEffect[], any>
  knowledgeArticle: KnowledgeArticle | undefined
  ticket: Ticket | undefined
}

export function QuickWorkspace<Mid> ( dataFn: WorkspaceStateFn<Mid, QuickData<Mid>> ):
  WorkSpacePlugin<Mid, QuickData<Mid>> {
  return ({
    tabName: 'Quick',
    dataFn,
    display: DisplayQuick
  });
}

export interface DisplayStateProps<S> extends LensProps2<S, NameAnd<Variables>, SideEffect[], any> {}
export function DisplayState<S> ( { state }: DisplayStateProps<S> ) {
  const stateData: any = state.optJson1 ()?.Summary?.variables?.state || {}
  const definition: TicketStateDefinition = stateData.definition ||{}
  return (<TableContainer component={Paper}>
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell>State</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries ( definition ).map ( ( [ button, buttonData ], index ) =>
          <TableRow key={button}>
            <TableCell>{button}</TableCell>
            <TableCell align="right">
            </TableCell>
          </TableRow> )}
      </TableBody>
    </Table>
  </TableContainer>);
}
export function DisplayQuick<S> ( { state: qd }: { state: QuickData<S> } ) {
  const { state, knowledgeArticle, ticket } = qd
  return <div>
    <p>The current knowledge article is <strong>{knowledgeArticle?.name || '<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <Grid container sx={{ height: '100%' }}>
      <Grid xs={6}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="textSecondary">Severity: {ticket?.severity}</Typography>
          <ReactMarkdown>{ticket?.description || ''}</ReactMarkdown>
        </Box>
      </Grid>
      <Grid xs={6}>
        <DisplayState state={state}/>
        <ChatButtons who='from quick' state={state} knowledgeArticle={knowledgeArticle}/>
      </Grid>
    </Grid>
  </div>

}
