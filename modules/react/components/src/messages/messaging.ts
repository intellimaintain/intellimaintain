import { AppendEvent } from "@intellimaintain/events";
import { SideEffect } from "@intellimaintain/react_core";
import { Message } from "@intellimaintain/domain";


export function makeSideeffectForMessage ( message: Message) : SideEffect{
  const event: AppendEvent = { event: 'append', path: 'conversation.messages', value:message, context: {} };
  let sideEffect: SideEffect = { command: 'event', event };
  return sideEffect;
}
