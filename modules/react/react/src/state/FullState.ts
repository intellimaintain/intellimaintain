import { SideEffect, SideeffectResult } from "../sideeffects/sideeffects";
import { Ticket } from "../ticket/ticket";
import { Conversation } from "@intellimaintain/apiclienteventstore";


export interface SelectionState {
  mainTab?: number
  topBottomSlider?: number
}
export type KnowledgeArticle = {
  title: string
  body: string
}

export interface ChatState {
  selectionState: SelectionState
  sideeffects: SideEffect[]
  log: SideeffectResult<any>[]
  conversation: Conversation
  sql: string[]
  ka: KnowledgeArticle
  ticket: Ticket
}
export function blankChatState ( chatter: string, responder: string, ka: KnowledgeArticle, ticket: Ticket ): ChatState {
  return {
    selectionState: {},
    sideeffects: [],
    log: [],
    conversation: { messages: [], chatter, responder },
    sql: [],
    ka,
    ticket
  }
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}