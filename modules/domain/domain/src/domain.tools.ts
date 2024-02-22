import { ParserStore, ParserStoreParser } from "@intellimaintain/parser";
import { SoftwareCatalog, Ticket } from "./domain";


export const ticketParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const index2 = s.indexOf ( '\n', index1 + 1 )
  if ( index2 < 0 ) return { error: 'No second newline found' }
  const name = s.slice ( 0, index1 )
  const priority = s.slice ( index1 + 1, index2 )
  const description = s.slice ( index2 + 1 )
  let ticket: Ticket = { id, name, severity: priority, description }
  return ticket
}
export const scParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const name = s.slice ( 0, index1 )
  const body = s.slice ( index1 + 1 )
  let ticket: SoftwareCatalog = { id, name, body }
  return ticket
}





