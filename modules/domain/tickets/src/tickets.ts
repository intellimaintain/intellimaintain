import { DomainPlugin } from "@intellimaintain/domain";
import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { addVariables, extractVariablesFromMarkdown, Variables } from "@intellimaintain/variables";
import { ParserStoreParser } from "@intellimaintain/parser";
import { IdAndName, SelectedAndList } from "@intellimaintain/utils";

export interface Ticket extends IdAndName {
  severity: string
  description: string
}
export type Tickets = SelectedAndList<Ticket>


export function variablesFromTicket ( sofar: NameAnd<any>, t: Ticket ): ErrorsAnd<Variables> {
  return addVariables ( extractVariablesFromMarkdown ( t.description ), { ticketId: t.id, severity: t.severity } )
}

export const ticketParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const index2 = s.indexOf ( '\n', index1 + 1 )
  if ( index2 < 0 ) return { error: 'No second newline found' }
  const name = s.slice ( 0, index1 ).trim ()
  const priority = s.slice ( index1 + 1, index2 ).trim ()
  const description = s.slice ( index2 + 1 ).trim ()
  let ticket: Ticket = { id, name, severity: priority, description }
  return ticket
}
export const ticketWriter = ( ticket: Ticket ) => `${ticket.name}\n${ticket.severity}\n${ticket.description}`;
export function ticketsPlugin ( rootPath: string ): DomainPlugin<Ticket> {
  return {
    prefix: 'ticket',
    parser: ticketParser,
    writer: ticketWriter,
    variablesExtractor: variablesFromTicket,
    idStoreDetails: { extension: 'md', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}
