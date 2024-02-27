import { LensProps2, LensState } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { calculateActionDetails, CommonState } from "./common.state";
import { replaceVar } from "@laoban/variables";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TestIcon from "@mui/icons-material/SettingsEthernet";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import { LdapTempSpace } from "./ldap.workspace";
import { FakeSendButton } from "./fake.send.button";


export interface EmailTempSpace<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}
export function EmailWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, EmailTempSpace<Mid, S1>> ): WorkSpacePlugin<Mid, EmailTempSpace<Mid, S1>> {
  return ({
    tabName: 'Email',
    dataFn,
    display: DisplayEmailWorkbench
  });
}


//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }


export function DisplayEmailWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: EmailTempSpace<S, S1> } ) {
  const { state } = qd
  const { knowledgeArticle, action, variables, title , actionName} = calculateActionDetails ( state, 'email' );
  if ( action?.by !== 'email' ) return <div>Action is not a email action it is {JSON.stringify ( action )}</div>

  const toName = (action as any).to
  const to = toName ? replaceVar ( 'finding to', '${' + toName + '}', variables, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } ) : ''
  const templateName = (action as any).template
  const cheatTemplate = state.optJson ()?.templates?.item?.template
  const rawTemplate = typeof cheatTemplate === 'string' ? cheatTemplate : 'Template not found ... just write email here'
  const template = derefence ( 'template', variables, rawTemplate, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )
  return <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>

    <Box marginBottom={2}>
      <Typography variant="subtitle1" gutterBottom>To variable {toName ? toName : 'not specified'}</Typography>
      <TextField fullWidth variant="outlined" value={to}/>
      <Typography variant="subtitle1" gutterBottom>Email</Typography>
      <TextField fullWidth variant="outlined" value={template} multiline rows={10}/>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
        <FakeSendButton state={state} icon={<PlayArrowIcon/>} actionName={actionName} message={`Need to make pretty gui still... Sent to ${toName}${template}`}>Send</FakeSendButton>
        {/*<Button variant="contained" color="primary" endIcon={<PlayArrowIcon/>}> Send </Button>*/}
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