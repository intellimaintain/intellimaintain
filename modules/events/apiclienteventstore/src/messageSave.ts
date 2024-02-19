import { Message } from "./conversation";
import { AppendEvent } from "@intellimaintain/events";

export interface MessageSave {
  url: string;

}
export function messageSaving ( url: string ): MessageSave {
  return { url }
}

export async function sendMessage ( save: MessageSave, msg: Message, path: string ) {
  const event: AppendEvent = {
    event: 'append',
    path,
    value: msg,
    context: {}
  }
  const response = await fetch ( save.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify ( event )
  } )
  if ( response.status < 400 ) return;
  throw new Error ( `Error sending message ${response.status}` )
}