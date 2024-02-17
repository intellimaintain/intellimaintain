export type BaseMessage = string


export interface ChatResponsePair {
  chat: BaseMessage;
  response: BaseMessage;
}

export type Conversation = {
  chatResponses: ChatResponsePair[]
  message?: string
  chatter: string
  responder: string
}

