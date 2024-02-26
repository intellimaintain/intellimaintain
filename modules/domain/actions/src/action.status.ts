import { Action } from "./actions";
import { fromEntries, mapObjectValues, NameAnd } from "@laoban/utils";

export interface WaitingStatus {
  name: string
  value: boolean | undefined
  status: string
}

export interface ActionStatus {
  action: Action
  waiting: NameAnd<WaitingStatus>
  cantStartBecause: string[]
}

export function value2Status ( value: boolean | undefined ): string {
  switch ( value ) {
    case true:
      return 'Yes';
    case false:
      return 'No';
    default:
      return 'Not finished';
  }
}
export const calcStatusFor = ( ticketStatus: NameAnd<boolean> ) => ( action: Action ): ActionStatus => {
  const waitingStrings = (action.waitingFor || '').split ( ',' ).map ( ( x: string ) => x.trim () ).filter ( ( x: string ) => x !== '' )
  const waiting: NameAnd<WaitingStatus> = {}
  waitingStrings.forEach ( w => {
    waiting[ w ] = { name: w, value: ticketStatus[ w ], status: value2Status ( ticketStatus[ w ] ) }
  } )
  const cantStartBecause = waitingStrings.filter ( w => waiting[ w ].value !== true )
  return { action, waiting, cantStartBecause }
};

export function calcStatusForAll ( ticketStatus: NameAnd<boolean>, actions: NameAnd<Action> ): NameAnd<ActionStatus> {
  return mapObjectValues ( actions, calcStatusFor ( ticketStatus ) )
}
export function filterFor ( actions: NameAnd<Action>, by: string ): NameAnd<Action> {
  return fromEntries ( ...Object.entries ( actions ).filter ( ( [ name, action ] ) => by.toLowerCase () === action?.by?.toLowerCase () ) )
}
export function calcStatusForWithBy ( ticketStatus: NameAnd<boolean>, by: string, actions: NameAnd<Action> ): NameAnd<ActionStatus> {
  return calcStatusForAll ( ticketStatus, filterFor ( actions, by ) )
}
