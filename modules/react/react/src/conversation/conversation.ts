export type Message={
  from: string
  message: string
}



export type Conversation = {
  chatResponses: Message[]
  message?: string
  chatter: string
  responder: string
}

