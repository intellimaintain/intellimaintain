import { LensState } from "@focuson/state";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { calculateActionDetails, CommonState } from "./common.state";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
import { FakeSendButton } from "./fake.send.button";


export interface ReceiveEmailWorkspace<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}
export function ReceiveEmailWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, ReceiveEmailWorkspace<Mid, S1>> ): WorkSpacePlugin<Mid, ReceiveEmailWorkspace<Mid, S1>> {
  return ({
    tabName: 'Receiveemail',
    dataFn,
    display: DisplayReceiveEmailWorkbench
  });
}


//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }


export function DisplayReceiveEmailWorkbench<S, S1 extends CommonState> ( { state: qd }: { state: ReceiveEmailWorkspace<S, S1> } ) {
  const { state } = qd
  const { knowledgeArticle, action, variables, title , actionName} = calculateActionDetails ( state, 'receiveEmail' );
  if ( action?.by !== 'receiveEmail' ) return <div>Action is not a receive email action it is {JSON.stringify ( action )}</div>

  return <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Box marginBottom={2}>
      <Typography variant="subtitle1" gutterBottom>Paste email here</Typography>
      <TextField fullWidth variant="outlined"   multiline rows={10}/>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
        <FakeSendButton state={state} icon={<PlayArrowIcon/>} actionName={actionName} message={`Need to make pretty gui still... received an email`}>Receive</FakeSendButton>
        <Button variant="contained" color="secondary" endIcon={<CancelIcon/>}> Cancel </Button>
      </Box>
    </Box>
  </Container>
}