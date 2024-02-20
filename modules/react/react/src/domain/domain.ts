import { SideEffect, SideeffectResult } from "../sideeffects/sideeffects";
import { Conversation } from "@intellimaintain/apiclienteventstore";
import { KnowledgeArticles } from "./ka/ka";
import { Tickets } from "./ticket/ticket";
import { SelectionState } from "../state/selection.state";
import { SoftwareCatalogs } from "./softwarecatalog/sc";
import { Variables } from "./variables/variables";


export type IdAndName = {
  id: string
  name: string
}
export interface SelectedAndList<T extends IdAndName> {
  options: IdAndName[]
  selected: string
  item: T | undefined //might not be loaded
}

export interface ChatState {
  selectionState: SelectionState
  sideeffects: SideEffect[]
  log: SideeffectResult<any>[]
  conversation: Conversation
  sql: string[]
  kas: KnowledgeArticles
  scs: SoftwareCatalogs
  variables: Variables
  tickets: Tickets
}
export function blankChatState ( chatter: string, responder: string, kas: KnowledgeArticles, scs: SoftwareCatalogs, tickets: Tickets, variables: Variables ): ChatState {
  return {
    selectionState: {},
    sideeffects: [],
    log: [],
    conversation: { messages: [], chatter, responder },
    sql: [],
    kas,
    scs,
    tickets,
    variables
  }
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}