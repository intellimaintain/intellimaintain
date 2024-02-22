import { SideEffect, SideeffectResult } from "../sideeffects/sideeffects";
import { SelectionState } from "../state/selection.state";
import { SoftwareCatalogs } from "./softwarecatalog/sc";
import { Conversation, IdAndName } from "@intellimaintain/domain";
import { KnowledgeArticles } from "./ka/ka";
import { Tickets } from "./ticket/ticket";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { EKnowledgeArticles } from "./experimentka/experimental.ka";

export interface SelectedAndList<T extends IdAndName> {
  options: IdAndName[]
  selected: string | undefined
  item: T | undefined //might not be loaded
}

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
    variables: {  }
  }
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}