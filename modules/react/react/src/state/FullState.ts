import { Conversation } from "../conversation/conversation";

export interface SelectionState {
  mainTab?: number
  topBottomSlider?: number
}
export type KnowledgeArticle ={
  title: string
  body: string
}
export interface ChatState {
  selectionState: SelectionState
  conversation: Conversation
  sql: string[]
  ka: KnowledgeArticle
}

export interface DemoChatState {
  chatState1: ChatState
  chatState2: ChatState
}