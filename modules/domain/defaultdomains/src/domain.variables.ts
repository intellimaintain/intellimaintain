import { Variables, VariablesExtractor } from "@intellimaintain/variables";
import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { DomainPlugin } from "@intellimaintain/domain";
import { ParserStore } from "@intellimaintain/parser";
import { kaPlugin, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { Ticket, ticketsPlugin } from "@intellimaintain/tickets";
import { AllIdStoreDetails } from "@intellimaintain/idstore";
import { SoftwareCatalog, softwareCatalogPlugin } from "@intellimaintain/softwarecatalog";


export function addVariables ( v: ErrorsAnd<Variables>, toAdd: NameAnd<string> ) {
  return mapErrors ( v, v => ({ variables: { ...v.variables, ...toAdd }, errors: v.errors }) )
}


const kaP: DomainPlugin<KnowledgeArticle> = kaPlugin ( 'ka' )
const ticketP: DomainPlugin<Ticket> = ticketsPlugin ( 'tickets' )
const scP: DomainPlugin<SoftwareCatalog> = softwareCatalogPlugin ( 'scs' )
export const defaultVariablesExtractor: VariablesExtractor = {
  ka: kaP.variablesExtractor,
  ticket: ticketP.variablesExtractor,
  sc: scP.variablesExtractor
}

export const defaultParserStore: ParserStore = {
  json: ( id, s ) => JSON.parse ( s ),
  string: ( id, s ) => s,
  ticket: ticketP.parser,
  sc: scP.parser,
  ka: kaP.parser
}
export function defaultIdStoreDetails ( root: string, parserStore: ParserStore ): AllIdStoreDetails {
  return {
    parserStore, details: {
      ka: { ...kaP.idStoreDetails, rootPath: root + '/' + kaP.idStoreDetails.rootPath },
      sc: { ...scP.idStoreDetails, rootPath: root + '/' + scP.idStoreDetails.rootPath },
      ticket: { ...ticketP.idStoreDetails, rootPath:  root + '/' +ticketP.idStoreDetails.rootPath }
    }
  }
}
export type IdPrefixes = 'ticket' | 'sc' | 'ka'