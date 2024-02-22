export type Message={
  who: string
  message: string
}

export type Conversation = {
  messages: Message[]
  message?: string
  chatter: string
  responder: string
}


export type IdAndName = {
  id: string
  name: string
}

export interface SoftwareCatalog extends IdAndName{
  body: string
}


