import { LensProps } from "@focuson/state";

export type Ticket = {
  number: string,
  description: string
}
export function DisplayTicket<S> ( { state }: LensProps<S, Ticket, any> ) {
  return <pre>{JSON.stringify ( state.optJson () || {}, null, 2 )}</pre>
}