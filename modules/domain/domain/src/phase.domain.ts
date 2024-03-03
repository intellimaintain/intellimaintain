export interface Phase {
  name: string
  description: string
  optional?: boolean
}

export const checkTicketPhase: Phase = {
  name: 'CheckTicket',
  description: 'Check if the ticket is valid'
}
export const approvalPhase: Phase = {
  name: 'Approval',
  description: 'Approve the ticket'
}
export const resolvePhase: Phase = {
  name: 'Resolve',
  description: 'Resolve the ticket'

}
export const closeTicketPhase: Phase = {
  name: 'Close',
  description: 'Close the ticket'
}

export const phases = [ checkTicketPhase, approvalPhase, resolvePhase, closeTicketPhase ]

export type PhaseName = 'CheckTicket' | 'Approval' | 'Resolve' | 'Close'
export const phaseNames: PhaseName[] = [ 'CheckTicket', 'Approval', 'Resolve', 'Close' ]
export type PhaseAnd<T> = Record<PhaseName, T>