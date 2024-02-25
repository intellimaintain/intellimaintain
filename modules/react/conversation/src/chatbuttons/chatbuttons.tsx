import React from 'react';
import { ButtonData, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { LensProps2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import SecurityIcon from '@mui/icons-material/Security';
import { Ticket } from "@intellimaintain/tickets";
import { makeSideeffectForMessage } from "@intellimaintain/components/dist/src/messages/messaging";

export interface ChatButtonProps<S> extends LensProps2<S, NameAnd<Variables>, SideEffect[], any> {

  knowledgeArticle: KnowledgeArticle | undefined
  who: string
}
function calcWhenFor ( buttonData: ButtonData, variables: any ): boolean {
  if ( buttonData.when === undefined ) return true
  return !!variables[ buttonData.when ]
}
function calcNotWhenFor ( buttonData: ButtonData, variables: any ) {
  if ( buttonData.notWhen === undefined ) return false
  return !!variables[ buttonData.notWhen ]

}
function calcDisabledFor ( buttonData: ButtonData, variables: any ) {
  if ( buttonData === undefined ) return false
  const when = calcWhenFor ( buttonData, variables )
  const notWhen = calcNotWhenFor ( buttonData, variables )
  return when === false || notWhen === true
}
export interface ActionTableProps<S> extends LensProps2<S, NameAnd<Variables>, SideEffect[], any> {
  buttons: NameAnd<ButtonData>
  who: string
}
function calcCondition ( buttonData: ButtonData ) {
  if ( buttonData.when ) return `When ${buttonData.when}`
  if ( buttonData.notWhen ) return `When not ${buttonData.notWhen}`
  return 'Always available';
}
function ActionTable<S> ( { buttons, state, who }: ActionTableProps<S> ) {
  return (<TableContainer component={Paper}>
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell>Activity Title</TableCell>
          <TableCell>Condition</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries ( buttons ).map ( ( [ button, buttonData ], index ) =>
          <TableRow key={button}>
            <TableCell>{button}</TableCell>
            <TableCell>{calcCondition ( buttonData )}</TableCell>
            <TableCell align="right">
              {/*<MessageButton key={index} disabled={disabled} state={state.state3 ()} message={{ message: buttonData.message, who }} label={text}/>*/}
              <Button startIcon={<FastForwardIcon/>} onClick={() => {
                state.state2 ().transform (
                  old => [ ...(old ?? []), makeSideeffectForMessage ( { message: buttonData.message, who } ) ], '' )
              }}> Quickly </Button>
              <Button startIcon={<SecurityIcon/>} onClick={() => {}} color="secondary"> Carefully </Button>
            </TableCell>
          </TableRow> )}
      </TableBody>
    </Table>
  </TableContainer>);
}

export function ChatButtons<S> ( { state, who, knowledgeArticle }: ChatButtonProps<S> ) {
  const buttons: NameAnd<ButtonData> = knowledgeArticle?.buttons || {}
  const variables: any = state.optJson1 ()?.Summary?.variables || {}
  console.log ( 'ChatButton', 'variables', variables )
  return <ActionTable buttons={buttons} state={state} who={who}/>
}