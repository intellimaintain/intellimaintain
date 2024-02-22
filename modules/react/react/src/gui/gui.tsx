import { LensProps } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { DisplaySoftwareCatalogs } from "@intellimaintain/react_softwarecatalog";
import { DisplayConversation } from "../domain/conversation/conversation.component";
import { DisplayVariables } from "../domain/variables/variables";
import { DisplayDebug, SimpleTabPanel, StateDisplay, TabPanel, TabsContainer, TabWithSideEffects, TwoRowLayout } from "@intellimaintain/components";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { DisplayTickets } from "@intellimaintain/react_ticket";

export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  label: string
  from: string
}
export function DisplayGui<S, C> ( { state, label, from }: DisplayGuiProps<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )

  return <TwoRowLayout state={state.focusOn ( 'selectionState' ).focusOn ( 'topBottomSlider' )}>
    <TabsContainer label={label} state={parentState}>
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
    <DisplayConversation from={from} state={state.doubleUp ().focus1On ( 'conversation' ).focus2On ( 'sideeffects' )}/>
  </TwoRowLayout>
}
