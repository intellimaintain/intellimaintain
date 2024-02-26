import React, { ReactNode } from "react";
import { AttributeTable } from "@intellimaintain/components";
import { escapeSqlParameters, extractSqlString } from "@intellimaintain/utils";
import { fromEntries } from "@laoban/utils";
import { derefence, VariableDefn } from "@laoban/variables";

export interface SqlDataProps {
  sql?: string
  variables: any
  children?: ReactNode
}
export const colonPrefixedVarDefn: VariableDefn = {
  regex: /(:[a-zA-Z0-9._]+)/g,
  removeStartEnd: ref => ref.slice ( 1 )
};

export function SqlData ( { sql, variables, children }: SqlDataProps ) {
  const environment = variables?.environment?.toString () || '<No Environment>'
  const database = variables?.database
  const type = database?.type?.toString () || '<No Type>'
  const name = database?.name?.toString () || '<No Name>'
  const user = database?.user?.toString () || '<No User>'
  const password = database?.password?.toString () || '<No Password>'
  const paramMetaData = database?.parameters
  const params: [ string, any ][] = extractSqlString ( sql ).map ( p => [ p, variables[ p ] === true ] )
  const paramsObj = fromEntries ( ...params )
  const sqlWithQuotes = escapeSqlParameters ( sql || '', paramMetaData|| {} )
  const derefedSql = derefence ( 'sql', variables, sqlWithQuotes, { variableDefn: colonPrefixedVarDefn, emptyTemplateReturnsSelf: true } )
  return <AttributeTable rows={{
    "Environment": environment,
    "Database": `${type} ${name}`,
    "User": user,
    "Password": password,
    "Raw Sql": sql || '',
    "Safer Sql": derefedSql
  }}/>
}

export function SqlDataAndTest ( props: SqlDataProps ) {
  const { sql, variables } = props
  return <><SqlData {...props}/>
    <button>Test connection</button>
    {props.children}
  </>
}