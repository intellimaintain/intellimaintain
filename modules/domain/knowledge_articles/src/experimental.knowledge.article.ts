import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin, IdAndName } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";

const yaml = require ( 'js-yaml' );

export interface BaseExperimentalKnowledgeArticle extends IdAndName {
  required: string[]
  softwareCatalog: string // mini dsl. sc1:production + sc2:acceptance|sc3:production
  approver?: string // e.g. specific email for POC. Might have dsl in future. If not here no approval needed
  variables?: NameAnd<string>
}

export type SqlDetailsType = 'atLeastOne' | 'none' | 'exactlyOne' | 'manual'
export interface JustCorrectSqlDetails {
  correctWhen: string
}
export interface SqlDetails {
  sql: string
  correctWhen?: string
}
export interface AdjustDatabaseSqlForKA {
  check: SqlDetails
  validate: SqlDetails
  resolve: SqlDetails | JustCorrectSqlDetails
}
export interface AdjustDatabaseSqlKS extends BaseExperimentalKnowledgeArticle {
  parent: 'katype:adjustDatabaseSql'
  sql: AdjustDatabaseSqlForKA
}

export interface InService1NotInService2KS extends BaseExperimentalKnowledgeArticle {
  parent: 'katype:inService1NotInService2'
}
export function isAdjustDatabaseSqlKS ( x: any ): x is AdjustDatabaseSqlKS {
  return x.parent === 'katype:adjustDatabaseSql'
}
export function isInService1NotInService2KS ( x: any ): x is InService1NotInService2KS {
  return x.parent === 'katype:inService1NotInService2'
}
export type ExperimentalKnowledgeArticle = AdjustDatabaseSqlKS | InService1NotInService2KS


export const ekaArticleParser: ParserStoreParser = ( id, s ): ErrorsAnd<ExperimentalKnowledgeArticle> => {
  console.log ( 'yaml - string', s )
  console.log ( 'yaml', yaml )
  const doc = yaml.load ( s )
  doc[ 'id' ] = id
  return doc
}

export function variablesFromEKnowledgeArticle ( eka: ExperimentalKnowledgeArticle ): ErrorsAnd<Variables> {
  return {
    variables: {
      'id': eka.id,
      'name': eka.name,
      'approver': eka.approver,
      ...(eka.variables)
    }, errors: []
  }
}

export function ekaPlugin ( rootPath: string ): DomainPlugin<ExperimentalKnowledgeArticle> {
  return {
    parser: ekaArticleParser,
    variablesExtractor: variablesFromEKnowledgeArticle,
    idStoreDetails: { extension: 'md', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}