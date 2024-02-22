import { extractVariablesFromMarkdown, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { DomainPlugin, scParser, SoftwareCatalog } from "@intellimaintain/domain";
import { ParserStore } from "@intellimaintain/parser";
import { ekaPlugin, ExperimentalKnowledgeArticle, kaPlugin, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { Ticket, ticketsPlugin } from "@intellimaintain/tickets";
import { AllIdStoreDetails } from "@intellimaintain/idstore";


export function addVariables ( v: ErrorsAnd<Variables>, toAdd: NameAnd<string> ) {
  return mapErrors ( v, v => ({ variables: { ...v.variables, ...toAdd }, errors: v.errors }) )
}

export function variablesFromSoftwareCatalog ( sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( sc.body )
}
const kaP: DomainPlugin<KnowledgeArticle> = kaPlugin ( 'ka' )
const ekaP: DomainPlugin<ExperimentalKnowledgeArticle> = ekaPlugin ( 'eka' )
const ticketP: DomainPlugin<Ticket> = ticketsPlugin ( 'tickets' )
export const defaultVariablesExtractor: VariablesExtractor = {
  ka: kaP.variablesExtractor,
  eka: ekaP.variablesExtractor,
  ticket: ticketP.variablesExtractor,
  sc: variablesFromSoftwareCatalog
}

export const defaultParserStore: ParserStore = {
  json: ( id, s ) => JSON.parse ( s ),
  string: ( id, s ) => s,
  ticket: ticketP.parser,
  sc: scParser,
  ka: kaP.parser,
  eka: ekaP.parser
}
export function defaultIdStoreDetails ( root: string, parserStore: ParserStore ): AllIdStoreDetails {
  return {
    parserStore, details: {
      eka: ekaP.idStoreDetails,
      ka: kaP.idStoreDetails,
      sc: { extension: 'md', rootPath: `${root}/scs`, mimeType: 'text/markdown; charset=UTF-8' },
      ticket: ticketP.idStoreDetails
    }
  }
}
export type IdPrefixes = 'ticket' | 'sc' | 'ka'