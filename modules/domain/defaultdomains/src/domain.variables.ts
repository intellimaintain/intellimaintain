import { VariablesExtractor } from "@intellimaintain/variables";
import { DomainPlugin, operatorPlugin } from "@intellimaintain/domain";
import { ParserStore } from "@intellimaintain/parser";
import { kaPlugin } from "@intellimaintain/knowledge_articles";
import { Ticket, ticketsPlugin } from "@intellimaintain/tickets";
import { AllIdStoreDetails } from "@intellimaintain/idstore";
import { softwareCatalogPlugin } from "@intellimaintain/softwarecatalog";
import { Template, templatePlugin } from "@intellimaintain/templates";
import { YamlCapability } from "@intellimaintain/yaml";


// const operatorP: DomainPlugin<Operator> = operatorPlugin ( 'operator' )
const ticketP: DomainPlugin<Ticket> = ticketsPlugin ( 'tickets' )
// const scP: DomainPlugin<SoftwareCatalog> = softwareCatalogPlugin ( 'scs' )
const templateP: DomainPlugin<Template> = templatePlugin ( 'templates' )

export function defaultVariablesExtractor ( yaml: YamlCapability ): VariablesExtractor {
  return {
    operator: operatorPlugin ( yaml, 'operator' ).variablesExtractor,
    ka: kaPlugin ( yaml, 'ka' ).variablesExtractor,
    ticket: ticketP.variablesExtractor,
    sc: softwareCatalogPlugin ( yaml, 'scs' ).variablesExtractor,
    template: templateP.variablesExtractor
  }
}

export function defaultParserStore ( yaml: YamlCapability ): ParserStore {
  return {
    json: ( id, s ) => JSON.parse ( s ),
    string: ( id, s ) => s,
    operator: operatorPlugin ( yaml, 'operator' ).parser,
    ticket: ticketP.parser,
    sc: softwareCatalogPlugin ( yaml, 'scs' ).parser,
    ka: kaPlugin ( yaml, 'ka' ).parser,
    template: templateP.parser
  }
}
export function defaultIdStoreDetails ( root: string, yaml: YamlCapability, parserStore: ParserStore ): AllIdStoreDetails {
  const operatorP = operatorPlugin ( yaml, 'operator' )
  const scP = softwareCatalogPlugin ( yaml, 'scs' )
  const kaP = kaPlugin ( yaml, 'ka' )
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
