import { PhaseAnd } from "@intellimaintain/phase";

export interface TicketType{
  name: string
  description: string
  phase: PhaseAnd<any>

}