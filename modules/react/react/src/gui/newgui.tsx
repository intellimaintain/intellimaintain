import { LensProps } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { SimpleTabPanel, TabPanel, TabsContainer, TabWithSideEffects } from "@intellimaintain/components/dist/src/layouts/TabPanel";
import { DisplayTickets } from "@intellimaintain/react_ticket/dist/src/display.ticket";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles/dist/src/display.knowledge.article";
import { DisplaySoftwareCatalogs } from "@intellimaintain/react_softwarecatalog/dist/src/display.software.catalog";

import { DisplayDebug, StateDisplay } from "@intellimaintain/components/dist/src/debug/display.debug";
import { DisplayConversation } from "@intellimaintain/react_conversation/dist/src/conversation.component";
import { MainAppLayout } from "@intellimaintain/components/dist/src/layouts/main.app.layout";
import { DisplayVariables } from "../variables/variables";

export interface TopPartProps<S, C> extends LensProps<S, ChatState, C> {
  label: string

}
export function TopPart<S, C> ( { state, label }: TopPartProps<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )
  return <TabsContainer label={label} state={parentState}>
    <TabWithSideEffects title='Ticket' state={state} focuson='tickets'>{state =>
      <DisplayTickets path='tickets' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='KSa' state={state} focuson='kas'>{state =>
      <DisplayKnowledgeArticles path='kas' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Catalog' state={state} focuson='scs'>{state =>
      <DisplaySoftwareCatalogs path='scs' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Variables' state={state} focuson='variables'>{state =>
      <DisplayVariables state={state}/>}</TabWithSideEffects>
    <TabPanel focuson='log' state={parentState} title='Log'>{state => <DisplayDebug state={state}/>}</TabPanel>
    <SimpleTabPanel title='State'><DisplayDebug state={state}/></SimpleTabPanel>
    <SimpleTabPanel title='Debug'><StateDisplay state={state}/></SimpleTabPanel>
  </TabsContainer>
}

export interface DisplayGui2Props<S, C> extends LensProps<S, ChatState, C> {
  label: string
  from: string
}
export function DisplayGui2<S, C> ( { state, label, from }: DisplayGui2Props<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )
  return <MainAppLayout>
    <TopPart label={label} state={state}/>
    <DisplayConversation from={from} state={state.doubleUp ().focus1On ( 'conversation' ).focus2On ( 'sideeffects' )}/>

  </MainAppLayout>
}
