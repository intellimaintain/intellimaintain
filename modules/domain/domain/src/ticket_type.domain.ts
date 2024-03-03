import { PhaseAnd } from "./phase.domain";

export interface TicketType{
  name: string
  description: string
  phase: PhaseAnd<any>

}