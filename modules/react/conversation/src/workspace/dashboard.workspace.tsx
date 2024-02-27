import { LensProps, LensState } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Action, ActionStatus, calcStatusForAll } from "@intellimaintain/actions";
import InfoIcon from '@mui/icons-material/Info';
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";
import { extractPathFromDescription, uppercaseFirstLetter } from "@intellimaintain/utils";
import { makeSideeffectForMessage } from "@intellimaintain/components";
import { CommonState, WorkspaceSelectionState } from "./common.state";
import { StatusIndicator } from "./status.indicator";
import { WaitingFor } from "./waiting.for";

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



interface YesNoButtonProps<S> extends LensProps<S, SideEffect[], any> {
  path: string
  who: string
  actionName: string
}
function setAction<S> ( state: LensState<S, SideEffect[], any>, rootPath: string, actionName: string, who: string, value: boolean ) {
  const path = rootPath + '.' + actionName
  state.transform ( old => [ ...(old || []),
    makeSideeffectForMessage ( { message: `Manually set ${actionName} to be ${value}`, who } ),
    { command: 'event', event: { event: 'setValue', path, value, context: {} } }
  ], '' )
}
export function YesButton<S> ( { state, path, actionName, who }: YesNoButtonProps<S> ) {
  return <Button variant="contained" color="primary" fullWidth onClick={() => setAction ( state, path, actionName, who, true )}>Yes</Button>
}
export function NoButton<S> ( { state, path, actionName, who }: YesNoButtonProps<S> ) {
  return <Button variant="contained" color="primary" fullWidth onClick={() => setAction ( state, path, actionName, who, false )}>No</Button>
}
export const ActionRow = <S, S1 extends CommonState> ( state: LensState<S, S1, any>, summary: any ) => ( [ actionName, actionStatus ]: [ string, ActionStatus ] ) => {
  const action = actionStatus.action
  const ticketState: NameAnd<boolean> = state.optJson ()?.ticketState || {}
  const who = summary?.operator?.email || 'unknown'

  const value = ticketState[ actionName ]
  const ActionTooltip = () => {
    return action.hint
      ? <span>{derefence ( '', summary, action.hint, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )}</span>
      : <></>;
  }

  const JsonTooltip = () => (
    <pre>{JSON.stringify ( { actionName: { action } }, null, 2 )}
    </pre>
  );
  const raw = extractPathFromDescription ( state.optional.description )

  const path = raw + ".ticketState."
  return <TableRow key={actionName}>
    <TableCell> <Tooltip title={<ActionTooltip/>} placement="top"><span>{actionName}</span></Tooltip></TableCell>
    <TableCell><StatusIndicator value={value}/></TableCell>
    <TableCell><WaitingFor ticketState={ticketState} waitingFor={action?.waitingFor}/></TableCell>
    <TableCell align="left">{action.by === 'manually' ? 'manually' :
      <ActionButton state={state.focusOn ( 'selectionState' )} action={action} actionName={actionName}/>} </TableCell>
    <TableCell align="left">
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <YesButton state={state.focusOn ( 'sideeffects' )} actionName={actionName} path={path} who={who}/>
        <NoButton state={state.focusOn ( 'sideeffects' )} actionName={actionName} path={path} who={who}/>
        <Tooltip title={<JsonTooltip/>} placement="top"><IconButton size="small"> <InfoIcon/> </IconButton></Tooltip>
      </div>
    </TableCell>
  </TableRow>
};
export interface ActionButtonProps<S> extends LensProps<S, WorkspaceSelectionState, any> {
  actionName: string
  action: Action

}
export function ActionButton<S> ( { action,actionName, state }: ActionButtonProps<S> ) {
  return <Button
    variant="contained" // Gives the button a background color
    color="primary" // Use the theme's primary color
    fullWidth
    onClick={() => {state.doubleUp().focus1On ( 'workspaceTab' ).focus2On('actionName').setJson ( uppercaseFirstLetter ( action.by.toLowerCase () ), actionName , '')}}
  >{action.by}</Button>
}

export interface DisplayTodoProps<S, S1 extends CommonState> extends LensProps<S, S1, any> {
  actionStatus: NameAnd<ActionStatus>
}

export function DisplayTodos<S, S1 extends CommonState> ( { state,actionStatus }: DisplayTodoProps<S, S1> ) {
  let summary: any = state.optJson ()?.variables.Summary?.variables || {};
  // console.log ( 'summary', summary )
  // const checkList: any = summary.checklist || {}
  // console.log ( 'checkList', checkList )
  // const definition: NameAnd<Action> = checkList || {}


  return (<TableContainer style={{ height: 'auto', maxWidth: '750px' }} component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>State</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Waiting For</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Manually</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries ( actionStatus ).map ( ActionRow (  state ,summary) )}
      </TableBody>
    </Table>
  </TableContainer>);
}
export function DisplayDashboard<S, S1 extends CommonState> ( { state: qd }: { state: DashBoardData<S, S1> } ) {
  const { state } = qd
  const knowledgeArticle: KnowledgeArticle|undefined = state.focusOn ( 'kas' ).optJson ()?.item
  const ticketState: NameAnd<boolean> = state.optJson ()?.ticketState || {}
  const actionStatus = calcStatusForAll(ticketState, knowledgeArticle?.checklist || {})
  return <div>
    <p>The current knowledge article is <strong>{knowledgeArticle?.name || '<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <DisplayTodos state={state} actionStatus={actionStatus}/>
  </div>
}
