import { LensProps, LensProps3, LensState, LensState3 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { Ticket } from "@intellimaintain/tickets";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Action } from "@intellimaintain/actions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
import { derefence } from "@laoban/variables";
import { dollarsBracesVarDefn } from "@laoban/variables/dist/src/variables";
import { dropFirstSegments, extractPathFromDescription } from "@intellimaintain/utils";
import { makeSideeffectForMessage } from "@intellimaintain/components/dist/src/messages/messaging";

export interface DashBoardData<S> {
  state: LensState3<S, NameAnd<boolean>, NameAnd<Variables>, SideEffect[], any>
  knowledgeArticle: KnowledgeArticle | undefined
  ticket: Ticket | undefined
  dropSegments: number
}

export function DashboardWorkspace<Mid> ( dataFn: WorkspaceStateFn<Mid, DashBoardData<Mid>> ):
  WorkSpacePlugin<Mid, DashBoardData<Mid>> {
  return ({
    tabName: 'Dashboard',
    dataFn,
    display: DisplayDashboard
  });
}

export interface DisplayTodoProps<S> extends LensProps3<S, NameAnd<boolean>, NameAnd<Variables>, SideEffect[], any> {
  dropSegments: number

}

interface StatusIndicatorProps {
  value: boolean | undefined

}
const StatusIndicator = ( { value }: StatusIndicatorProps ) => {
  let icon;
  switch ( value ) {
    case true:
      icon = <CheckIcon style={{ color: 'green' }}/>;
      break;
    case false:
      icon = <CloseIcon style={{ color: 'red' }}/>;
      break;
    default:
      icon = <HourglassEmptyIcon style={{ color: 'gray' }}/>;
  }

  return <div>{icon}</div>;
};
interface WaitingProps {
  ticketState: NameAnd<boolean>,
  waiting: string
}
function Waiting ( { ticketState, waiting }: WaitingProps ) {
  const value = ticketState[ waiting ]
  let accessibilityMessage = '';
  if ( value === undefined ) return <span aria-label='Awaiting'>{waiting}</span>
  if ( value === true ) return <span aria-label='Allowed' style={{ opacity: 0.5 }}>{waiting}</span>
  return <span aria-label='Action failed' style={{ color: 'red', opacity: 0.5 }}>{waiting}</span>
}
interface WaitingForProps {
  ticketState: NameAnd<boolean>
  waitingFor: string
}
function WaitingFor ( { ticketState, waitingFor }: WaitingForProps ) {
  const waitingForList = (waitingFor || '').split ( ',' ).map ( ( x: string ) => x.trim () ).filter ( ( x: string ) => x !== '' )
  return <>{waitingForList.map ( w => <>{waitingForList.map ( w => <Waiting ticketState={ticketState} waiting={w}/> )} </> )}</>
}

interface YesNoButtonProps<S> extends LensProps<S, SideEffect[], any> {
  path: string
  who: string
  actionName: string
}
export function setAction<S> ( state: LensState<S, SideEffect[], any>, rootPath: string, actionName: string, who: string, value: boolean ) {
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
export const ActionRow = <S extends any> ( variables: any, state: LensState3<S, NameAnd<boolean>, NameAnd<Variables>, SideEffect[], any>, dropSegments: number ) => ( [ actionName, action ]: [ string, Action ] ) => {
  const ticketState: NameAnd<boolean> = state.optJson1 () || {}
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
  const raw = extractPathFromDescription ( state.lens1.description )
  const path = dropFirstSegments ( raw, dropSegments )
  return <TableRow key={actionName}>
    <TableCell> <Tooltip title={<ActionTooltip/>} placement="top"><span>{actionName}</span></Tooltip></TableCell>
    <TableCell><StatusIndicator value={value}/></TableCell>
    <TableCell><WaitingFor ticketState={ticketState} waitingFor={action.waitingFor}/></TableCell>
    <TableCell align="left"><ActionButton action={action}/> </TableCell>
    <TableCell align="left">
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <YesButton state={state.state3 ()} actionName={actionName} path={path} who={who}/>
        <NoButton state={state.state3 ()} actionName={actionName} path={path} who={who}/>
        <Tooltip title={<JsonTooltip/>} placement="top"><IconButton size="small"> <InfoIcon/> </IconButton></Tooltip>
      </div>
    </TableCell>
  </TableRow>
};
export interface ActionButtonProps {
  action: Action
}
export function ActionButton ( { action }: ActionButtonProps ) {
  return <Button
    variant="contained" // Gives the button a background color
    color="primary" // Use the theme's primary color
    fullWidth
  >{action.by}</Button>
}
export function DisplayTodos<S> ( { state, dropSegments }: DisplayTodoProps<S> ) {

  let summary: any = state.optJson2 ()?.Summary?.variables || {};

  console.log ( 'summary', summary )
  const checkList: any = summary.checklist || {}
  console.log ( 'checkList', checkList )
  const definition: NameAnd<Action> = checkList || {}
  return (<TableContainer style={{ height: 'auto', maxWidth: '750px' }} component={Paper}>
    <Table size='small'>
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
        {Object.entries ( definition ).map ( ActionRow ( summary, state, dropSegments, ) )}
      </TableBody>
    </Table>
  </TableContainer>);
}
export function DisplayDashboard<S> ( { state: qd }: { state: DashBoardData<S> } ) {
  const { state, knowledgeArticle, ticket, dropSegments } = qd
  return <div>
    <p>The current knowledge article is <strong>{knowledgeArticle?.name || '<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <DisplayTodos state={state} dropSegments={dropSegments}/>
  </div>
}
