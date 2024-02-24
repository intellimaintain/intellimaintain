import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin, IdAndName } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";
import { transformKeysToCamelCase } from "@intellimaintain/utils";

const yaml = require ( 'js-yaml' );

export interface ButtonData{
  text?: string
  message: string
  when?: string
  notWhen?: string
}

export interface BaseKnowledgeArticle extends IdAndName {
  required: string[]
  softwareCatalog: string // mini dsl. sc1:production + sc2:acceptance|sc3:production
  approver?: string // e.g. specific email for POC. Might have dsl in future. If not here no approval needed
  variables?: NameAnd<string>
  buttons?: NameAnd<ButtonData>
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
export interface AdjustDatabaseSqlKS extends BaseKnowledgeArticle {
  parent: 'katype:adjustDatabaseSql'
  sql: AdjustDatabaseSqlForKA
}

export interface InService1NotInService2KS extends BaseKnowledgeArticle {
  parent: 'katype:inService1NotInService2'
}
export function isAdjustDatabaseSqlKS ( x: any ): x is AdjustDatabaseSqlKS {
  return x.parent === 'katype:adjustDatabaseSql'
}
export function isInService1NotInService2KS ( x: any ): x is InService1NotInService2KS {
  return x.parent === 'katype:inService1NotInService2'
}
export type KnowledgeArticle = AdjustDatabaseSqlKS | InService1NotInService2KS


export const kaArticleParser: ParserStoreParser = ( id, s ): ErrorsAnd<KnowledgeArticle> => {
  const doc = transformKeysToCamelCase<any> ( yaml.load ( s ) )
  return { id, ...doc }
}

export function variablesFromKnowledgeArticle ( sofar: NameAnd<any>, ka: KnowledgeArticle ): ErrorsAnd<Variables> {
  let variables: NameAnd<any> = {
    'id': ka.id,
    'name': ka.name,
    ...ka
  }
  return { variables, errors: [] }
}

export function kaPlugin ( rootPath: string ): DomainPlugin<KnowledgeArticle> {
  return {
    prefix: 'ka',
    parser: kaArticleParser,
    variablesExtractor: variablesFromKnowledgeArticle,
    idStoreDetails: { extension: 'yaml', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}