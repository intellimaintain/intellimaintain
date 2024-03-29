import { ListIds } from "@intellimaintain/listids";
import { KnowledgeArticle, KnowledgeArticles } from "@intellimaintain/knowledge_articles";
import { SoftwareCatalog, SoftwareCatalogs } from "@intellimaintain/softwarecatalog";
import { Ticket, Tickets } from "@intellimaintain/tickets";
import { Template, Templates } from "@intellimaintain/templates";
import { IdAndName, SelectedAndList } from "@intellimaintain/utils";
import { IdStore, isGoodIdStoreResult } from "@intellimaintain/idstore";
import { Operator } from "@intellimaintain/domain";

export type InitialLoadDataResult = {
  operator?: Operator
  error?: string[]
}
export async function loadInitialData ( idStore: IdStore ): Promise<InitialLoadDataResult> {
  const operator = await idStore ( 'operator:me', 'operator' )
  if ( isGoodIdStoreResult ( operator ) ) {
    return { operator: operator.result as any }
  } else {
    return { error: [ operator.error ] }
  }
}
export type InitialLoadIdResult = {
  kas: KnowledgeArticles
  scs: SoftwareCatalogs
  tickets: Tickets
  templates: Templates
}

export async function loadInitialIds ( listIds: ListIds ): Promise<InitialLoadIdResult> {

  const kaIds = await listIds ( 'ka' )
  console.log ( 'kaIds', kaIds )
  const scIds = await listIds ( 'sc' )
  console.log ( 'scIds', scIds )
  const ticketIds = await listIds ( 'ticket' )
  console.log ( 'ticketIds', ticketIds )
  const templateIds = await listIds ( 'template' )
  console.log ( 'template', templateIds )
  function make<T extends SelectedAndList<T1>, T1 extends IdAndName> ( ids: string[], fn: ( s: SelectedAndList<T1> ) => T ): T {
    return fn ( { options: ids.map ( k => ({ id: k, name: k }) ) } )
  }
  return {
    kas: make<KnowledgeArticles, KnowledgeArticle> ( kaIds, s => s ),
    scs: make<SoftwareCatalogs, SoftwareCatalog> ( scIds, s => s ),
    tickets: make<Tickets, Ticket> ( ticketIds, s => s ),
    templates: make<Templates, Template> ( templateIds, s => s )
  }
}
