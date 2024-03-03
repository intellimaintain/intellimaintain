import { Conversation } from "@intellimaintain/domain";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";

import { Action, ActionStatus, calcStatusForWithBy } from "@intellimaintain/actions";
import { LensState } from "@focuson/state";
import { KnowledgeArticle, KnowledgeArticles } from "@intellimaintain/knowledge_articles";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";

import { uppercaseFirstLetter } from "@intellimaintain/utils";
import { Tickets } from "@intellimaintain/tickets";
import { Templates } from "@intellimaintain/templates";
import { SideEffect } from "./sideeffects";
import { SoftwareCatalogs } from "@intellimaintain/softwarecatalog";

export interface WorkspaceSelectionState {
  workspaceTab?: string
  actionName?: string
}
export interface CommonStateForActionDetails {
  kas: KnowledgeArticles
  ticketState: NameAnd<boolean>
  selectionState: WorkspaceSelectionState
  variables: NameAnd<Variables>
}
export interface DebugState {
  showDevMode?: boolean
  selectedDebugTab?: string

}
export interface CommonState extends CommonStateForActionDetails {
  sideeffects: SideEffect[]
  conversation: Conversation
  variables: NameAnd<Variables>
  tickets: Tickets
  templates: Templates
  scs: SoftwareCatalogs
  kas: KnowledgeArticles

}

export interface ActionDetails {
  knowledgeArticle: KnowledgeArticle | undefined
  actionName: string
  action: Action | undefined
  variables: any
  title: string
}

export function calculateActionDetails<S, S1 extends CommonStateForActionDetails> ( state: LensState<S, S1, any>, by: string ): ActionDetails {
  let commonState = state.optJson ();
  const knowledgeArticle: KnowledgeArticle | undefined = commonState?.kas?.item
  const ticketState: NameAnd<boolean> = commonState?.ticketState || {}
  const nameAndActionStatus = calcStatusForWithBy ( ticketState, by, knowledgeArticle?.checklist || {} )
  const selected = commonState?.selectionState?.actionName || ''
  const actionStatus: ActionStatus = nameAndActionStatus[ selected ]
  const action = actionStatus?.action
  const hint = action?.hint || ''
  const variables = commonState?.variables?.Summary?.variables || {}
  const title = derefence ( 'Title', variables, hint, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )
  return { knowledgeArticle, action, variables, title, actionName: actionStatus?.actionName };
}
export function onClickAction<S, S1 extends CommonState> ( state: LensState<S, S1, any>, actionStatus: ActionStatus ) {
  return () => state.focusOn ( 'selectionState' ).doubleUp ()
    .focus1On ( 'workspaceTab' )
    .focus2On ( 'actionName' )
    .setJson ( uppercaseFirstLetter ( actionStatus.action.by.toLowerCase () ), actionStatus.actionName, '' )
}
