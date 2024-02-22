import { SelectionState } from "../state/selection.state";
import { Conversation } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { SideEffect, SideeffectResult } from "@intellimaintain/react_core";
import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { SoftwareCatalogs } from "@intellimaintain/react_softwarecatalog"
import { Tickets } from "@intellimaintain/react_ticket";


export interface ChatState {
  selectionState: SelectionState
  sideeffects: SideEffect[]
  log: SideeffectResult<any>[]
  conversation: Conversation
  sql: string[]
  kas: KnowledgeArticles
  scs: SoftwareCatalogs
  variables: NameAnd<Variables>
  tickets: Tickets
}
export function blankChatState ( chatter: string, responder: string, kas: KnowledgeArticles ,scs: SoftwareCatalogs, tickets: Tickets ): ChatState {
  return {
    selectionState: {},
    sideeffects: [],
    log: [],
    conversation: { messages: [], chatter, responder },
    sql: [],
    kas,
    scs,
    tickets,
    variables: {}
  }
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}