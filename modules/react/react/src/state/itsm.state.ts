import { CommonState, DebugState, SideEffect, SideeffectResult, WorkspaceSelectionState } from "@intellimaintain/react_core";
import { Lens, Lenses } from "@focuson/lens";
import { ColumnLeftMainState } from "@intellimaintain/components";
import { Ticket } from "@intellimaintain/tickets";
import { ChatDisplayData, Operator } from "@intellimaintain/domain";

export interface ItsmSelectionState extends WorkspaceSelectionState {
  mainScreen?: ColumnLeftMainState
}
export interface ItsmState extends CommonState {
  ticket: Ticket
  operator: Operator
  log: SideeffectResult<any>[],
  selectionState: ItsmSelectionState
  debug?:DebugState
}

export const startAppState: ItsmState = {
  sideeffects: [],
  log: [],
  conversation: { messages: [], chat: { type: '' } },
  variables: {},
  ticket: undefined as any as Ticket,
  operator: undefined as any as Operator,
  tickets: { options: [] },
  templates: { options: [] },
  scs: { options: [] },
  kas: { options: [] },
  ticketState: {},
  selectionState: {},
}

export const itsmIdL: Lens<ItsmState, ItsmState> = Lenses.identity ()
export const operatorL: Lens<ItsmState, Operator> = itsmIdL.focusOn ( 'operator' )
export const chatDataL: Lens<ItsmState, ChatDisplayData<any>> =
               itsmIdL.focusOn ( 'conversation' ).focusOn ( 'chat' )
export const ticketL: Lens<ItsmState, Ticket> = itsmIdL.focusOn ( 'ticket' )
export const sideEffectsL: Lens<ItsmState, SideEffect[]> = itsmIdL.focusOn ( 'sideeffects' )
export const logsL: Lens<ItsmState, SideeffectResult<any>[]> = itsmIdL.focusOn ( 'log' )