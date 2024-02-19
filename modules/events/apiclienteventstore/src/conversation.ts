
export type Message={
  from: string
  to: string
  message: string
}

export type Conversation = {
  messages: Message[]
  message?: string
  chatter: string
  responder: string
}

