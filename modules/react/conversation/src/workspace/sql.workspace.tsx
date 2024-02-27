import { LensProps, LensProps2, LensState } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceSideEffectPlugin, WorkspaceStateFn, WorkspaceStateSideEffectFn } from "./workspace";
import React from "react";
import { calculateActionDetails, CommonState } from "./common.state";
import { DashBoardData, DisplayTodos } from "./dashboard.workspace";
import { isAdjustDatabaseSqlKS, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { calcStatusForAll, calcStatusForWithBy } from "@intellimaintain/actions";
import { SqlDataAndTest, SqlDataTable } from "../displayplugins/SqlData";
import { findSqlDataDetails } from "@intellimaintain/defaultdomains";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TestIcon from '@mui/icons-material/SettingsEthernet'; // Example icon for "Test Connection"
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';

export interface SqlTempSpace<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}

export function SqlWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, SqlTempSpace<Mid, S1>> ): WorkSpacePlugin<Mid, SqlTempSpace<Mid, S1>> {
  return ({
    tabName: 'Sql',
    dataFn,
    display: DisplaySqlWorkbench
  });
}

export function DisplaySqlWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: SqlTempSpace<S, S1> } ) {
  const { state } = qd
  const { knowledgeArticle, action, variables, title } = calculateActionDetails ( state,  'sql' );

  if ( action.by !== 'sql' ) return <div>Action is not a sql action it is {JSON.stringify ( action )}</div>
  if ( !isAdjustDatabaseSqlKS ( knowledgeArticle ) ) return <div><p>Not a SQL knowledge article</p></div>
  const type = (action as any)?.type || ''
  const sqlData = knowledgeArticle?.sql?.[ type ]
  const sql = sqlData?.sql
  const correctWhen = sqlData?.correctWhen
  const details = findSqlDataDetails ( sql || '', variables )

  return <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>

    <Box marginBottom={2}>
      <Typography variant="subtitle1" gutterBottom>SQL to execute</Typography>
      <TextField fullWidth variant="outlined" value={details.derefedSql} multiline rows={4}/>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
        <Button variant="contained" color="primary" endIcon={<PlayArrowIcon/>}> Execute </Button>
        <Button variant="contained" color="primary" endIcon={<TestIcon/>}> Test Connection </Button>
        <Button variant="contained" color="primary" endIcon={<RefreshIcon/>}> Reset</Button>
        <Button variant="contained" color="secondary" endIcon={<CancelIcon/>}> Cancel </Button>
      </Box>

    </Box>

    <Paper style={{ padding: '16px', marginBottom: '16px' }}>
      {correctWhen && <Typography variant="subtitle1">The result is correct when "{correctWhen.toString ()}"</Typography>}

    </Paper>

    <SqlDataTable details={details}/>
  </Container>
}


