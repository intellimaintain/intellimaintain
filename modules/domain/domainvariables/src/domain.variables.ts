import { extractVariablesFromMarkdown, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { DomainPlugin, scParser, SoftwareCatalog, Ticket, ticketParser } from "@intellimaintain/domain";
import { ParserStore } from "@intellimaintain/parser";
import { ekaPlugin, ExperimentalKnowledgeArticle, kaPlugin, KnowledgeArticle } from "@intellimaintain/knowledge_articles";


export function addVariables ( v: ErrorsAnd<Variables>, toAdd: NameAnd<string> ) {
  return mapErrors ( v, v => ({ variables: { ...v.variables, ...toAdd }, errors: v.errors }) )
}
export function variablesFromTicket ( t: Ticket ): ErrorsAnd<Variables> {
  return addVariables ( extractVariablesFromMarkdown ( t.description ), { ticketId: t.id, severity: t.severity } )
}


export function variablesFromSoftwareCatalog ( sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( sc.body )
}
const kaP: DomainPlugin<KnowledgeArticle> = kaPlugin ( 'ka' )
const ekaP: DomainPlugin<ExperimentalKnowledgeArticle> = ekaPlugin ( 'eka' )

export const defaultVariablesExtractor: VariablesExtractor = {
  ka: kaP.variablesExtractor,
  eka: ekaP.variablesExtractor,
  ticket: variablesFromTicket,
  sc: variablesFromSoftwareCatalog
}

export const defaultParserStore: ParserStore = {
  json: ( id, s ) => JSON.parse ( s ),
  string: ( id, s ) => s,
  ticket: ticketParser,
  sc: scParser,
  ka: kaP.parser,
  eka: ekaP.parser
}
