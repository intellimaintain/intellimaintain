import { LensState } from "@focuson/state";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { calculateActionDetails, CommonState } from "./common.state";
import { isAdjustDatabaseSqlKS } from "@intellimaintain/knowledge_articles";
import { findSqlDataDetails } from "@intellimaintain/defaultdomains";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TestIcon from "@mui/icons-material/SettingsEthernet";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import { SqlDataTable } from "../displayplugins/SqlData";
import { replaceVar } from "@laoban/variables/dist/src/variables";
import { dollarsBracesVarDefn } from "@laoban/variables";

export interface LdapTempSpace<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}
export function LdapWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, LdapTempSpace<Mid, S1>> ): WorkSpacePlugin<Mid, LdapTempSpace<Mid, S1>> {
  return ({
    tabName: 'Ldap',
    dataFn,
    display: DisplayLdapWorkbench
  });
}


//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }
export function DisplayLdapWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: LdapTempSpace<S, S1> } ) {
  const { state } = qd
  const { knowledgeArticle, action, variables, title } = calculateActionDetails ( state, 'ldap' );
  if ( action.by !== 'ldap' ) return <div>Action is not a sql action it is {JSON.stringify ( action )}</div>

  const whoName = (action as any).who
  const who = whoName && replaceVar ( 'finding who', '${'+ whoName+'}', variables, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )

  return <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>

    <Box marginBottom={2}>
      <Typography variant="subtitle1" gutterBottom>User name</Typography>
      <TextField fullWidth variant="outlined" value={who}/>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
        <Button variant="contained" color="primary" endIcon={<PlayArrowIcon/>}> Execute </Button>
        <Button variant="contained" color="primary" endIcon={<TestIcon/>}> Test Connection </Button>
        <Button variant="contained" color="primary" endIcon={<RefreshIcon/>}> Reset</Button>
        <Button variant="contained" color="secondary" endIcon={<CancelIcon/>}> Cancel </Button>
      </Box>
    </Box>

    {/*<Paper style={{ padding: '16px', marginBottom: '16px' }}>*/}
    {/*  {correctWhen && <Typography variant="subtitle1">The result is correct when "{correctWhen.toString ()}"</Typography>}*/}
    {/*</Paper>*/}
    {/*<pre>{JSON.stringify ( action, null, 2 )}</pre>*/}
    {/*<pre>{JSON.stringify ( variables?.approval, null, 2 )}</pre>*/}
    {/*<pre>{JSON.stringify ( variables?.approval?.to, null, 2 )}</pre>*/}
    {/*<pre>{JSON.stringify ( variables, null, 2 )}</pre>*/}

  </Container>
}
