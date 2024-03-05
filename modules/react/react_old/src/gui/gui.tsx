import { LensProps, LensState2 } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { DisplayDebug, SimpleTabPanel, StateDisplay, TabWithSideEffects, TemplateFn } from "@intellimaintain/components";
import { DisplayTickets } from "@intellimaintain/react_ticket";
import { DisplayKnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { DisplaySoftwareCatalogs, DisplaySqlConfig } from "@intellimaintain/react_softwarecatalog";
import { DisplayConversation, HasDisplayPlugins, HasWorkspacePlugins, WorkspaceTabsWithPlugins } from "@intellimaintain/react_conversation";

import { DisplayTemplates } from "@intellimaintain/react_templates/";
import { DisplaySqlWorkbench } from "@intellimaintain/react_sql";
import { DisplayVariables } from "@intellimaintain/react_variables";

export interface TopPartProps<S, C> extends LensProps<S, ChatState, C> {
  label: string

}

export interface ChatAreaProps<S, C> extends LensProps<S, ChatState, C> {
  tabsHeight: string

}

export function ChatArea<S, C extends HasDisplayPlugins & HasWorkspacePlugins<ChatState>> ( { state, tabsHeight }: ChatAreaProps<S, C> ) {
  let tabState: LensState2<S, ChatState, any/*hack to keep this running while migrating away */, any> = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'workspaceTab' );


  return <WorkspaceTabsWithPlugins height={tabsHeight} state={tabState}>
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
    <SimpleTabPanel title='Sql2'><DisplaySqlWorkbench maxHeight='75vh' maxWidth='40vw' state={state.focusOn ( 'selectionState' ).focusOn ( 'sql' )}/></SimpleTabPanel>
    <SimpleTabPanel title='SqlConfig'><DisplaySqlConfig state={state.focusOn ( 'selectionState' ).focusOn ( 'sqlConfig' )}/></SimpleTabPanel>
    <SimpleTabPanel title='State'><DisplayDebug maxHeight='75vh' maxWidth='40vw' state={state}/></SimpleTabPanel>
    <SimpleTabPanel title='Debug'><StateDisplay maxHeight='75vh' maxWidth='40vw' state={state}/></SimpleTabPanel>
  </WorkspaceTabsWithPlugins>
}

export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  tabsHeight: string
  from: string
  path: string
  template: TemplateFn<S>
}
export function DisplayGui<S, C extends HasDisplayPlugins & HasWorkspacePlugins<ChatState>> ( { state, tabsHeight, from, path, template }: DisplayGuiProps<S, C> ) {
  return <DisplayConversation from={from} path={path + 'conversation.'} template={template}
                              state={state.tripleUp ().focus1On ( 'conversation' ).focus2On ( 'variables' ).focus3On ( 'sideeffects' )}>
    <ChatArea state={state} tabsHeight='75h'/>
  </DisplayConversation>
}
