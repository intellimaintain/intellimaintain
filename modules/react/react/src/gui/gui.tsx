import { LensProps } from "@focuson/state";

import { SimpleTabPanel, TabPanel, TabsContainer, TabWithSideEffects } from "../layouts/TabPanel";

import { TwoRowLayout } from "../layouts/TwoRowLayout";

import { DisplayKnowledgeArticles } from "../domain/ka/ka";
import { DisplayTickets } from "../domain/ticket/ticket";
import { ChatState } from "../domain/domain";
import { DisplaySoftwareCatalogs } from "../domain/softwarecatalog/sc";
import { DisplayConversation } from "../domain/conversation/conversation.component";
import { DisplayVariables } from "../domain/variables/variables";
import { DisplayEKnowledgeArticles } from "../domain/experimentka/experimental.ka";
import { DisplayDebug, StateDisplay } from "@intellimaintain/components";


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
      <TabWithSideEffects title='EKSa' state={state} focuson='ekas'>{state =>
        <DisplayEKnowledgeArticles path='ekas' state={state}/>}</TabWithSideEffects>
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
