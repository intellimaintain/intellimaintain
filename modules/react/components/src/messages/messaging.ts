import { AppendEvent } from "@intellimaintain/events";
import { SideEffect } from "@intellimaintain/react_core";
import { BaseMessage } from "@intellimaintain/domain";


export function makeSideeffectForMessage<M extends BaseMessage> ( message: M ): SideEffect {
  const event: AppendEvent = { event: 'append', path: 'conversation.messages', value: message, context: {} };
  let sideEffect: SideEffect = { command: 'event', event };
  return sideEffect;
}
