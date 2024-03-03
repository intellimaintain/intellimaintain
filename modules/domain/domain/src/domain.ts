import { PartialFunctionK } from "@intellimaintain/utils";

export interface BaseMessage {
  type: string
  who: string
}
export interface Message extends BaseMessage {
  type: 'message'
  message: string
}
export function isMessage ( message: BaseMessage | undefined ): message is Message {
  return message?.type === 'message'
}

export type ChatDisplayData<T> = {
  type: string
  data?: T
}
export type Conversation = {
  messages: BaseMessage[]
  chat?: ChatDisplayData<any>
  message?: string //TODO legacy get rid of when remove old react gui
}

export type QuestionPFK<S> = PartialFunctionK<S, ChatDisplayData<any>>

