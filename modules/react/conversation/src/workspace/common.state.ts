import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles/dist";
import { SideEffect } from "@intellimaintain/react_core";
import { Conversation } from "@intellimaintain/domain";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { Tickets } from "@intellimaintain/react_ticket/dist/src/display.ticket";

export interface WorkspaceSelectionState {
  workspaceTab?: string
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