import { escapeSqlParameters, extractSqlString } from "@intellimaintain/utils";
import { fromEntries, NameAnd } from "@laoban/utils";
import { derefence, VariableDefn } from "@laoban/variables";

export interface SqlDataDetails {
  environment: string
  type: string
  name: string
  user: string
  password: string
  paramMetaData: any
  params: NameAnd<any>
  sql: string
  sqlWithQuotes: string
  derefedSql: string
}
export const colonPrefixedVarDefn: VariableDefn = {
  regex: /(:[a-zA-Z0-9._]+)/g,
  removeStartEnd: ref => ref.slice ( 1 )
};
export function findSqlDataDetails ( sql: string, variables: any ): SqlDataDetails {
  const environment = variables?.environment?.toString () || '<No Environment>'
  const database = variables?.database
  const type = database?.type?.toString () || '<No Type>'
  const name = database?.name?.toString () || '<No Name>'
  const user = database?.user?.toString () || '<No User>'
  const password = database?.password?.toString () || '<No Password>'
  const paramMetaData = database?.parameters
  const params: [ string, any ][] = extractSqlString ( sql ).map ( p => [ p, variables[ p ] === true ] )
  const paramsObj = fromEntries ( ...params )
  const sqlWithQuotes = escapeSqlParameters ( sql || '', paramMetaData || {} )
  const derefedSql = derefence ( 'sql', variables, sqlWithQuotes, { variableDefn: colonPrefixedVarDefn, emptyTemplateReturnsSelf: true } )
  return {
    environment,
    type,
    name,
    user,
    password,
    paramMetaData,
    params: paramsObj,
    sql,
    sqlWithQuotes,
    derefedSql
  }
}
