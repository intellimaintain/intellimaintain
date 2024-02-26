import { NameAnd } from "@laoban/utils";
import React from "react";

export interface WaitingProps {
  ticketState: NameAnd<boolean>,
  waiting: string
}
export function Waiting ( { ticketState, waiting }: WaitingProps ) {
  const value = ticketState[ waiting ]
  let accessibilityMessage = '';
  if ( value === undefined ) return <span aria-label='Awaiting'>{waiting}</span>
  if ( value === true ) return <span aria-label='Allowed' style={{ opacity: 0.5 }}>{waiting}</span>
  return <span aria-label='Action failed' style={{ color: 'red', opacity: 0.5 }}>{waiting}</span>
}
export interface WaitingForProps {
  ticketState: NameAnd<boolean>
  waitingFor: string | undefined
}
export function WaitingFor ( { ticketState, waitingFor }: WaitingForProps ) {
  const waitingForList = (waitingFor || '').split ( ',' ).map ( ( x: string ) => x.trim () ).filter ( ( x: string ) => x !== '' )
  return <>{waitingForList.map ( w => <>{waitingForList.map ( w => <Waiting ticketState={ticketState} waiting={w}/> )} </> )}</>
}