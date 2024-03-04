import { BaseMessage, Message } from "@intellimaintain/domain";
import { Event } from "@intellimaintain/events";

export interface SendEvents {
  url: string;
}
export function sendEvents ( url: string ): SendEvents {
  return { url }
}

export async function sendEvent ( save: SendEvents, event: Event ) {
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
export async function sendMessage ( save: SendEvents, msg: BaseMessage, path: string ) {
  return sendEvent ( save, { event: 'append', path, value: msg, context: {} } )
}