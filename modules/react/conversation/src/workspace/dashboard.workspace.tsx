import { LensProps, LensState } from "@focuson/state";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { ActionStatus, calcStatusForAll } from "@intellimaintain/actions";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";
import { extractPathFromDescription, splitAndCapitalize } from "@intellimaintain/utils";
import { CommonState, onClickAction } from "./common.state";
import { StatusIndicator } from "./status.indicator";
import ErrorIcon from '@mui/icons-material/Error';
import { InPlaceMenu } from "./inPlaceMenu";

export interface DashBoardData<S, S1 extends CommonState> {
  state: LensState<S, S1, any>
}

export function DashboardWorkspace<Mid, S1 extends CommonState> ( dataFn: WorkspaceStateFn<Mid, DashBoardData<Mid, S1>> ):
  WorkSpacePlugin<Mid, DashBoardData<Mid, S1>> {
  return ({
    tabName: 'Dashboard',
    dataFn,
    display: DisplayDashboard
  });
}

export interface ActionTitleProps<S, S1> extends LensProps<S, S1, any> {
  actionStatus: ActionStatus
  summary: any
  actionValue: boolean | undefined
}

export function ActionTitle<S, S1 extends CommonState> ( { state, summary, actionStatus, actionValue }: ActionTitleProps<S, S1>, ) {
  const { action, actionName } = actionStatus
  const ActionTooltip = () => {
    return action.hint
      ? <span>{derefence ( '', summary, action.hint, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )}</span>
      : <></>;
  }
  const disabled = actionStatus.cantStartBecause.length > 0 || actionValue !== undefined
  return <Tooltip title={<ActionTooltip/>} placement="top">
    {disabled ?
      <span>{splitAndCapitalize ( actionName )}</span> :
      <Button onClick={onClickAction ( state, actionStatus )} variant="text"> {splitAndCapitalize ( actionName )}</Button>}
  </Tooltip>

}

export const ActionRow = <S, S1 extends CommonState> ( state: LensState<S, S1, any>, summary: any ) => ( [ actionName, actionStatus ]: [ string, ActionStatus ] ) => {
  const action = actionStatus.action
  const ticketState: NameAnd<boolean> = state.optJson ()?.ticketState || {}
  const who = summary?.operator?.email || 'unknown'

  const actionValue = ticketState[ actionName ]

  const JsonTooltip = () => (
    <pre>{JSON.stringify ( { actionName: { action } }, null, 2 )}
    </pre>
  );
  const raw = extractPathFromDescription ( state.optional.description )

  const path = raw + ".ticketState."
  const disabled = actionStatus.cantStartBecause.length > 0
  const problem = actionValue === true && disabled

  return <TableRow key={actionName}>
    <TableCell>
      <ActionTitle actionStatus={actionStatus} summary={summary} state={state} actionValue={actionValue}/>
    </TableCell>
    <TableCell>
      <Box display="flex" alignItems="center"><StatusIndicator value={actionValue}/>{problem && <ErrorIcon/>}</Box>
    </TableCell>
    <TableCell> <InPlaceMenu state={state} actionStatus={actionStatus} rootPath={path} who={who}/></TableCell>
  </TableRow>
};
export interface ActionButtonProps<S, S1 extends CommonState> extends LensProps<S, S1, any> {
  actionStatus: ActionStatus
  disabled?: boolean
  actionValue: boolean
}
export function OutOfTurnActionButton<S, S1 extends CommonState> ( { actionStatus, state, disabled, actionValue }: ActionButtonProps<S, S1> ) {
  const done = actionValue !== undefined
  const notReady = actionStatus.cantStartBecause.length > 0
  const title = done ? 'Do again' : notReady ? 'Do it anyway' : undefined
  if ( title === undefined ) return <></>
  return <Button
    variant="text"
    color="secondary"
    style={{ textTransform: 'none' }}
    onClick={onClickAction ( state, actionStatus )}
  >({title})</Button>
}

export interface DisplayTodoProps<S, S1 extends CommonState> extends LensProps<S, S1, any> {
  actionStatus: NameAnd<ActionStatus>
}

export function DisplayTodos<S, S1 extends CommonState> ( { state, actionStatus }: DisplayTodoProps<S, S1> ) {
  let summary: any = state.optJson ()?.variables.Summary?.variables || {};
  return (<TableContainer style={{ height: 'auto', maxWidth: '750px' }} component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Check List</TableCell>
          <TableCell>Done</TableCell>
          <TableCell>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries ( actionStatus ).map ( ActionRow ( state, summary ) )}
      </TableBody>
    </Table>
  </TableContainer>);
}
export function DisplayDashboard<S, S1 extends CommonState> ( { state: qd }: { state: DashBoardData<S, S1> } ) {
  const { state } = qd
  const knowledgeArticle: KnowledgeArticle | undefined = state.focusOn ( 'kas' ).optJson ()?.item
  const ticketState: NameAnd<boolean> = state.optJson ()?.ticketState || {}
  const actionStatus = calcStatusForAll ( ticketState, knowledgeArticle?.checklist || {} )
  return <div>
    <p>The current knowledge article is <strong>{knowledgeArticle?.name || '<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <DisplayTodos state={state} actionStatus={actionStatus}/>
  </div>
}
