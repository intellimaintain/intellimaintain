import { LensProps } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { SimpleTabPanel, TabPanel, TabsContainer, TabWithSideEffects } from "@intellimaintain/components/dist/src/layouts/TabPanel";
import { DisplayTickets } from "@intellimaintain/react_ticket/dist/src/display.ticket";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles/dist/src/display.knowledge.article";
import { DisplaySoftwareCatalogs } from "@intellimaintain/react_softwarecatalog";

import { DisplayDebug, MainAppLayout, StateDisplay, TemplateFn } from "@intellimaintain/components";
import { ChatButton, DisplayConversation, HasDisplayPlugins } from "@intellimaintain/react_conversation";
import { DisplayVariables } from "../variables/variables";
import { Lenses } from "@focuson/lens";
import { DisplayTemplates } from "@intellimaintain/react_templates/src/display.template";

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
    <TabWithSideEffects title='Templates' state={state} focuson='templates'>{state =>
      <DisplayTemplates path='templates' state={state}/>}</TabWithSideEffects>
    <TabWithSideEffects title='Variables' state={state} focuson='variables'>{state =>
      <DisplayVariables state={state}/>}</TabWithSideEffects>
    <SimpleTabPanel title='State'><DisplayDebug maxHeight='40vh' maxWidth = '40vw' state={state}/></SimpleTabPanel>
    <SimpleTabPanel title='Debug'><StateDisplay maxHeight='40vh' maxWidth = '40vw'state={state}/></SimpleTabPanel>
  </TabsContainer>
}

export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  label: string
  from: string
  path: string
  template: TemplateFn<S>
}
export function DisplayGui<S, C extends HasDisplayPlugins> ( { state, label, from, path, template }: DisplayGuiProps<S, C> ) {
  console.log ( 'DisplayGui', 'state', state )
  return <MainAppLayout>
    <TopPart label={label} state={state}/>
    <div>
      <DisplayConversation from={from} path={path + 'conversation.'} template={template}
                           state={state.tripleUp ().focus1On ( 'conversation' ).focus2On ( 'variables' ).focus3On ( 'sideeffects' )}>
        <ChatButton who={from} state={state.tripleUp ().focus1On ( 'kas' ).focus1On ( 'item' ).focus2On ( 'variables' ).focus3On ( 'sideeffects' )}/>
      </DisplayConversation>
    </div>

  </MainAppLayout>
}
