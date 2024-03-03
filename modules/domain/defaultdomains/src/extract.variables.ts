import { addManyVariablesFromSelectedAndList, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { Operator } from "@intellimaintain/domain";
import { KnowledgeArticles } from "@intellimaintain/knowledge_articles";
import { Tickets } from "@intellimaintain/tickets";
import { SoftwareCatalogs } from "@intellimaintain/softwarecatalog";

export function extractVariablesForAllDomain ( ve: VariablesExtractor,
                                               operator: Operator,
                                               tickets: Tickets,
                                               kas: KnowledgeArticles,
                                               scs: SoftwareCatalogs ): NameAnd<Variables> {
  const { result, acc, errors } = addManyVariablesFromSelectedAndList ( ve,
    { Operator: { variables: operator as any, errors: [] } },
    { Ticket: tickets, 'Knowledge Article': kas, 'Software Catalog': scs } )
  result[ 'Summary' ] = { variables: acc, errors }
  return result
}
