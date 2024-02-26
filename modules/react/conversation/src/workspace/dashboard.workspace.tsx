import { LensProps, LensState } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Action } from "@intellimaintain/actions";
import InfoIcon from '@mui/icons-material/Info';
import { derefence } from "@laoban/variables";
import { dollarsBracesVarDefn } from "@laoban/variables/dist/src/variables";
import { extractPathFromDescription, uppercaseFirstLetter } from "@intellimaintain/utils";
import { makeSideeffectForMessage } from "@intellimaintain/components/dist/src/messages/messaging";
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

export interface DisplayTodoProps<S, S1 extends CommonState> extends LensProps<S, S1, any> {
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
export const ActionRow = <S, S1 extends CommonState> ( variables: any, state: LensState<S, S1, any> ) => ( [ actionName, action ]: [ string, Action ] ) => {
  const ticketState: NameAnd<boolean> = state.optJson ()?.ticketState || {}
  const who = variables?.operator?.email || 'unknown'
  const value = ticketState[ actionName ]
  const ActionTooltip = () => {
    return action.hint
      ? <span>{derefence ( '', variables, action.hint, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )}</span>
      : <></>;
  }

  const JsonTooltip = () => (
    <pre>{JSON.stringify ( { actionName: { action } }, null, 2 )}
    </pre>
  );
  const raw = extractPathFromDescription ( state.optional.description )
  const path = raw
  return <TableRow key={actionName}>
    <TableCell> <Tooltip title={<ActionTooltip/>} placement="top"><span>{actionName}</span></Tooltip></TableCell>
    <TableCell><StatusIndicator value={value}/></TableCell>
    <TableCell><WaitingFor ticketState={ticketState} waitingFor={action.waitingFor}/></TableCell>
    <TableCell align="left">{action.by === 'manually' ? 'manually' : <ActionButton state={state.focusOn ( 'selectionState' )} action={action}/>} </TableCell>
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
  action: Action

}
export function ActionButton<S> ( { action, state }: ActionButtonProps<S> ) {
  return <Button
    variant="contained" // Gives the button a background color
    color="primary" // Use the theme's primary color
    fullWidth
    onClick={() => {state.focusOn ( 'workspaceTab' ).setJson ( uppercaseFirstLetter ( action.by.toLowerCase () ), action )}}
  >{action.by}</Button>
}
export function DisplayTodos<S, S1 extends CommonState> ( { state }: DisplayTodoProps<S, S1> ) {
  let summary: any = state.optJson ()?.variables.Summary?.variables || {};
  console.log ( 'summary', summary )
  const checkList: any = summary.checklist || {}
  console.log ( 'checkList', checkList )
  const definition: NameAnd<Action> = checkList || {}
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
        {Object.entries ( definition ).map ( ActionRow ( summary, state ) )}
      </TableBody>
    </Table>
  </TableContainer>);
}
export function DisplayDashboard<S, S1 extends CommonState> ( { state: qd }: { state: DashBoardData<S, S1> } ) {
  const { state } = qd
  const knowledgeArticle: KnowledgeArticle|undefined = state.focusOn ( 'kas' ).optJson ()?.item
  return <div>
    <p>The current knowledge article is <strong>{knowledgeArticle?.name || '<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <DisplayTodos state={state}/>
  </div>
}
