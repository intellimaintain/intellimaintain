import { VariablesExtractor } from "@intellimaintain/variables";
import { DomainPlugin,Operator, operatorPlugin  } from "@intellimaintain/domain";
import { ParserStore } from "@intellimaintain/parser";
import { kaPlugin, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { Ticket, ticketsPlugin } from "@intellimaintain/tickets";
import { AllIdStoreDetails } from "@intellimaintain/idstore";
import { SoftwareCatalog, softwareCatalogPlugin } from "@intellimaintain/softwarecatalog";
import { Template, templatePlugin } from "@intellimaintain/templates";


const operatorP: DomainPlugin<Operator> = operatorPlugin ( 'operator' )
const kaP: DomainPlugin<KnowledgeArticle> = kaPlugin ( 'ka' )
const ticketP: DomainPlugin<Ticket> = ticketsPlugin ( 'tickets' )
const scP: DomainPlugin<SoftwareCatalog> = softwareCatalogPlugin ( 'scs' )
const templateP: DomainPlugin<Template> = templatePlugin ( 'templates' )

export const defaultVariablesExtractor: VariablesExtractor = {
  operator: operatorP.variablesExtractor,
  ka: kaP.variablesExtractor,
  ticket: ticketP.variablesExtractor,
  sc: scP.variablesExtractor,
  template: templateP.variablesExtractor
}

export const defaultParserStore: ParserStore = {
  json: ( id, s ) => JSON.parse ( s ),
  string: ( id, s ) => s,
  operator: operatorP.parser,
  ticket: ticketP.parser,
  sc: scP.parser,
  ka: kaP.parser,
  template: templateP.parser
}
export function defaultIdStoreDetails ( root: string, parserStore: ParserStore ): AllIdStoreDetails {
  return {
    parserStore, details: {
      operator: { ...operatorP.idStoreDetails, rootPath: root + '/' + operatorP.idStoreDetails.rootPath },
      ka: { ...kaP.idStoreDetails, rootPath: root + '/' + kaP.idStoreDetails.rootPath },
      sc: { ...scP.idStoreDetails, rootPath: root + '/' + scP.idStoreDetails.rootPath },
      ticket: { ...ticketP.idStoreDetails, rootPath: root + '/' + ticketP.idStoreDetails.rootPath },
      template: { ...templateP.idStoreDetails, rootPath: root + '/' + templateP.idStoreDetails.rootPath }
    }
  }
}
