import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles/dist";
import { SideEffect } from "@intellimaintain/react_core";
import { Conversation } from "@intellimaintain/domain";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { Tickets } from "@intellimaintain/react_ticket/dist/src/display.ticket";
import { Action, calcStatusForWithBy } from "@intellimaintain/actions";
import { LensState } from "@focuson/state";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";

export interface WorkspaceSelectionState {
  workspaceTab?: string
  actionName?: string
}

export interface CommonState {
  selectionState: WorkspaceSelectionState
  sideeffects: SideEffect[]
  conversation: Conversation
  kas: KnowledgeArticles
  variables: NameAnd<Variables>
  tickets: Tickets
  ticketState: NameAnd<boolean>
}

export interface ActionDetails {
  knowledgeArticle: KnowledgeArticle | undefined
  action: Action | undefined
  variables: any
  title: string

}

export function calculateActionDetails<S, S1 extends CommonState >( state: LensState<S, S1, any> , by: string): ActionDetails {
  let commonState = state.optJson ();
  const knowledgeArticle: KnowledgeArticle | undefined = commonState?.kas?.item
  const ticketState: NameAnd<boolean> = commonState?.ticketState || {}
  const nameAndActionStatus = calcStatusForWithBy ( ticketState, by, knowledgeArticle?.checklist || {} )
  const selected = commonState?.selectionState?.actionName || ''
  const actionStatus = nameAndActionStatus[ selected ]
  const action = actionStatus?.action
  const hint = action?.hint || ''
  const variables = commonState?.variables?.Summary?.variables || {}
  const title = derefence ( 'Title', variables, hint, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )
  return { knowledgeArticle, action, variables, title };
}
