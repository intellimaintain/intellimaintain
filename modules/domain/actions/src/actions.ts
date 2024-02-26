import { NameAnd } from "@laoban/utils";


export interface Action {
  by: string
  waitingFor?: string
  hint?: string
}

export interface SafeAction extends Action  {
  safe?: boolean
}
export function isSafeAction ( x: any ): x is SafeAction {
  return x.safe === true
}

export type TicketStateDefinition = NameAnd<Action>
