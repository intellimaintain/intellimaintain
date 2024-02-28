export type Message={
  who: string
  message: string
}

export type Conversation = {
  messages: Message[]
  message?: string
  chatter: string
}


export type IdAndName = {
  id: string
  name: string
}
export interface SelectedAndList<T extends IdAndName> {
  options: IdAndName[]
  selected: string | undefined
  item: T | undefined //might not be loaded
}
