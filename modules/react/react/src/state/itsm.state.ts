import { CommonState, SideEffect, SideeffectResult, WorkspaceSelectionState } from "@intellimaintain/react_core";
import { Lens, Lenses } from "@focuson/lens";
import { ColumnLeftMainState } from "@intellimaintain/components";

export interface ItsmSelectionState extends WorkspaceSelectionState {
  mainScreen?: ColumnLeftMainState
}
export interface ItsmState extends CommonState {
  log: SideeffectResult<any>[],
  selectionState: ItsmSelectionState
}

export const startAppState: ItsmState = {
  sideeffects: [],
  log: [],
  conversation: { messages: [] },
  variables: {},
  tickets: { options: [] },
  templates: { options: [] },
  scs: { options: [] },
  kas: { options: [] },
  ticketState: {},
  selectionState: {},
}

export const itsmIdL: Lens<ItsmState, ItsmState> = Lenses.identity ()
export const sideEffectsL: Lens<ItsmState, SideEffect[]> = itsmIdL.focusOn ( 'sideeffects' )
export const logsL: Lens<ItsmState, SideeffectResult<any>[]> = itsmIdL.focusOn ( 'log' )