import { LensProps } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { SimpleTabPanel, TabPanel, TabsContainer, TabWithSideEffects } from "@intellimaintain/components/dist/src/layouts/TabPanel";
import { DisplayTickets } from "@intellimaintain/react_ticket/dist/src/display.ticket";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles/dist/src/display.knowledge.article";
import { DisplaySoftwareCatalogs } from "@intellimaintain/react_softwarecatalog";

import { DisplayDebug, MainAppLayout, StateDisplay } from "@intellimaintain/components";
import { DisplayConversation, HasDisplayPlugins } from "@intellimaintain/react_conversation";
import { DisplayVariables } from "../variables/variables";
import { Lenses } from "@focuson/lens";

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

export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  label: string
  from: string
  path: string
}
export function DisplayGui<S, C extends HasDisplayPlugins> ( { state, label, from, path }: DisplayGuiProps<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )
  return <MainAppLayout>
    <TopPart label={label} state={state}/>
    <DisplayConversation from={from} path={path+ 'conversation.'} state={state.tripleUp ().focus1On ( 'conversation' ).focus2On ( 'variables' ).focus3On ( 'sideeffects' )}/>

  </MainAppLayout>
}
