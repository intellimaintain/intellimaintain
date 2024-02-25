import { LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { ChatButtons } from "../chatbuttons/chatbuttons";
import { Ticket } from "@intellimaintain/tickets";
import { Box, Grid, Typography } from "@mui/material";
import { DisplayMarkdown } from "@intellimaintain/components/dist/src/displayRaw/display.markdown";
import ReactMarkdown from "react-markdown";


export interface QuickData<S> {
  state: LensState2<S, NameAnd<Variables>, SideEffect[], any>
  knowledgeArticle: KnowledgeArticle | undefined
  ticket: Ticket | undefined
}

export function QuickWorkspace<Mid> ( dataFn: WorkspaceStateFn<Mid, QuickData<Mid>> ):
  WorkSpacePlugin<Mid, QuickData<Mid>> {
  return ({
    tabName: 'Dashboard',
    dataFn,
    display: DisplayQuick

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

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
        <p>Here we should put the 'are you approved? Have you been checked? Have you been resolved? Have you been validated etc</p>
        <ChatButtons who='from quick' state={state} ticket={ticket} knowledgeArticle={knowledgeArticle}/>
      </Grid>
    </Grid>
  </div>

}
