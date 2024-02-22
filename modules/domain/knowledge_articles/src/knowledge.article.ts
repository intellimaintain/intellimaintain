import { DomainPlugin, IdAndName } from "@intellimaintain/domain";
import { ParserStoreParser } from "@intellimaintain/parser";
import { ErrorsAnd } from "@laoban/utils";
import { extractVariablesFromMarkdown, Variables } from "@intellimaintain/variables";
import { addVariables } from "@intellimaintain/domainvariables";

export interface KnowledgeArticle extends IdAndName {
  body: string
}
export const kaArticleParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const name = s.slice ( 0, index1 )
  const body = s.slice ( index1 + 1 )
  let ticket: KnowledgeArticle = { id, name, body }
  return ticket
}
export function variablesFromKnowledgeArticle ( ka: KnowledgeArticle ): ErrorsAnd<Variables> {
  return addVariables ( extractVariablesFromMarkdown ( ka.body ), { 'kaId': ka.id, 'kaName': ka.name } )
}

export function kaPlugin ( rootPath: string ): DomainPlugin<KnowledgeArticle> {
  return {
    prefix: 'ka',
    parser: kaArticleParser,
    variablesExtractor: variablesFromKnowledgeArticle,
    idStoreDetails: { extension: 'md', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}
