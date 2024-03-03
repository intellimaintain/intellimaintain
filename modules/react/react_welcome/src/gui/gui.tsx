import { LensProps, LensState2 } from "@focuson/state";
import { CommonState } from "@intellimaintain/react_core";
import React from "react";
import { DisplayTickets } from "@intellimaintain/react_ticket";
import { DisplayDebug, SimpleTabPanel, StateDisplay, TabPanelDetails, TabsContainer, TabWithSideEffects, TemplateFn } from "@intellimaintain/components";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { DisplaySoftwareCatalogs } from "@intellimaintain/react_softwarecatalog";
import { DisplayTemplates } from "@intellimaintain/react_templates";
import { DisplayVariables } from "@intellimaintain/react_variables";


export interface ChatAreaProps<S, CS extends CommonState> extends LensProps<S, CS, any> {
  tabsHeight: string
}
export function ChatArea<S, CS extends CommonState> ( { state, tabsHeight }: ChatAreaProps<S, CS> ) {
  let tabState: LensState2<S, CS, string | undefined, any> = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'workspaceTab' );
  return <TabsContainer label='The Label' height={tabsHeight} state={tabState}>
    <TabWithSideEffects title='Ticket' state={state} focuson='tickets'>{state =>
      <DisplayTickets path='tickets' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='KSa' state={state} focuson='kas'>{state =>
      <DisplayKnowledgeArticles path='kas' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Catalog' state={state} focuson='scs'>{state =>
      <DisplaySoftwareCatalogs path='scs' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Templates' state={state} focuson='templates'>{state =>
      <DisplayTemplates path='templates' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Variables' state={state} focuson='variables'>{state =>
      <DisplayVariables state={state}/>}</TabWithSideEffects>
    <SimpleTabPanel title='Debug'><StateDisplay maxHeight='75vh' maxWidth='40vw' state={state}/></SimpleTabPanel>
    <SimpleTabPanel title='State'><DisplayDebug maxHeight='75vh' maxWidth='40vw' state={state}/></SimpleTabPanel>
  </TabsContainer>
}

export interface DisplayGuiProps<S, CS extends CommonState> extends LensProps<S, CS, any> {
  tabsHeight: string
  from: string
  path: string
  template: TemplateFn<S>
}
export function DisplayGui<S, CS extends CommonState> ( { state, tabsHeight, from, path, template }: DisplayGuiProps<S, CS> ) {
  return <ChatArea state={state} tabsHeight='75h'/>
}
