import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin, IdAndName } from "@intellimaintain/domain";
import { ErrorsAnd } from "@laoban/utils";
import { extractVariablesFromMarkdown, Variables } from "@intellimaintain/variables";
import { Ticket, ticketParser, variablesFromTicket } from "@intellimaintain/tickets";

export interface SoftwareCatalog extends IdAndName{
  body: string
}

export function variablesFromSoftwareCatalog ( sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( sc.body )
}

export const scParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const name = s.slice ( 0, index1 )
  const body = s.slice ( index1 + 1 )
  let softwareCatalog: SoftwareCatalog = { id, name, body }
  return softwareCatalog
}
export function softwareCatalogPlugin ( rootPath: string ): DomainPlugin<SoftwareCatalog> {
  return {
    prefix: 'sc',
    parser: scParser,
    variablesExtractor: variablesFromSoftwareCatalog,
    idStoreDetails: { extension: 'md', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}