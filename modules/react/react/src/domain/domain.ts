import { SelectionState } from "../state/selection.state";
import { SoftwareCatalogs } from "./softwarecatalog/sc";
import { Conversation } from "@intellimaintain/domain";
import { Tickets } from "./ticket/ticket";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { SideEffect, SideeffectResult } from "@intellimaintain/react_core";
import { EKnowledgeArticles, KnowledgeArticles } from "@intellimaintain/react_knowledge_articles";


export interface ChatState {
  selectionState: SelectionState
  sideeffects: SideEffect[]
  log: SideeffectResult<any>[]
  conversation: Conversation
  sql: string[]
  kas: KnowledgeArticles
  ekas: EKnowledgeArticles
  scs: SoftwareCatalogs
  variables: NameAnd<Variables>
  tickets: Tickets
}
export function blankChatState ( chatter: string, responder: string, kas: KnowledgeArticles, ekas: EKnowledgeArticles, scs: SoftwareCatalogs, tickets: Tickets ): ChatState {
  return {
    selectionState: {},
    sideeffects: [],
    log: [],
    conversation: { messages: [], chatter, responder },
    sql: [],
    kas,
    ekas,
    scs,
    tickets,
    variables: {}
  }
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}