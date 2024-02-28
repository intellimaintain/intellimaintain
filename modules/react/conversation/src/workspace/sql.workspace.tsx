import { LensState } from "@focuson/state";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { calculateActionDetails, CommonState } from "@intellimaintain/react_core";
import { isAdjustDatabaseSqlKS } from "@intellimaintain/knowledge_articles";
import { SqlDataTable } from "../displayplugins/SqlData";
import { findSqlDataDetails } from "@intellimaintain/defaultdomains";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TestIcon from '@mui/icons-material/SettingsEthernet'; // Example icon for "Test Connection"
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import { FakeSendButton } from "./fake.send.button";

export interface SqlTempSpace<S, S1> {
  state: LensState<S, S1, any>
}

export function SqlWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, SqlTempSpace<Mid, S1>> ): WorkSpacePlugin<Mid, SqlTempSpace<Mid, S1>> {
  return ({
    tabName: 'Sql',
    dataFn,
    display: DisplaySqlWorkbench
  });
}

function getSqlPrefiledDetailsIfExist<S, S1 extends CommonState> ( state: LensState<S, S1, any> ) {
  const { knowledgeArticle, action, variables, title, actionName } = calculateActionDetails ( state, 'sql' );
  if ( action?.by !== 'sql' ) return {}
  if ( !isAdjustDatabaseSqlKS ( knowledgeArticle ) ) return {}
  const type: string = (action as any)?.type?.toString () || ''
  const sqlData: any = (knowledgeArticle?.sql as any)?.[ type ]
  const sql = sqlData?.sql
  const correctWhen = sqlData?.correctWhen
  return {sql, variables, type,  correctWhen, title, actionName }

}
export function DisplaySqlWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: SqlTempSpace<S, S1> } ) {
  const { state } = qd
  const { sql, variables, type, title, actionName, correctWhen } = getSqlPrefiledDetailsIfExist ( state )
  const details = findSqlDataDetails ( sql || '', variables )

  return <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>

    <Box marginBottom={2}>
      <Typography variant="subtitle1" gutterBottom>SQL to execute</Typography>
      <TextField fullWidth variant="outlined" value={details?.derefedSql} multiline rows={4}/>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
        <Button variant="contained" color="primary" endIcon={<TestIcon/>}>Execute </Button>
        <Button variant="contained" color="primary" endIcon={<TestIcon/>}> Test Connection </Button>
        <Button variant="contained" color="primary" endIcon={<RefreshIcon/>}> Reset</Button>
      </Box>
      <Typography variant="subtitle1" gutterBottom>SQL Result</Typography>
      <TextField fullWidth variant="outlined" multiline rows={4}/>
      <Paper style={{ padding: '16px', marginBottom: '16px' }}>
        {correctWhen && <Typography variant="subtitle1">The result is correct when "{correctWhen.toString ()}"</Typography>}
      </Paper>
      {type && <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
          <FakeSendButton state={state} icon={<PlayArrowIcon/>} actionName={actionName} message={`[${type}Sql]`} value={true}>The result is good</FakeSendButton>
          <FakeSendButton state={state} icon={<PlayArrowIcon/>} actionName={actionName} message={`[${type}Sql]`} value={false}>The result is bad</FakeSendButton>
          <Button variant="contained" color="secondary" endIcon={<CancelIcon/>}> Cancel </Button>
      </Box>}
      <Typography variant="subtitle1" gutterBottom>SQL Result</Typography>

    </Box>


    <SqlDataTable details={details}/>
  </Container>
}


