import React, { ReactNode } from "react";
import { AttributeTable, BeforeAfterComponent, DisplayMessagePlugin, MessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import { escapeSqlParameters, extractSqlString, uppercaseFirstLetter } from "@intellimaintain/utils";
import { fromEntries } from "@laoban/utils/dist/src/nameAnd";
import { derefence, VariableDefn } from "@laoban/variables";
import { Typography } from "@mui/material";
import { NameAnd } from "@laoban/utils";

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
  const sqlWithQuotes = escapeSqlParameters ( sql || '', paramMetaData )
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

export interface GenericSqlPlugin {
  beforeAfterRex: RegExp
  sqlFn: ( v: NameAnd<any> ) => string
  children?: ( text: string ) => ReactNode
}

export function genericSqlDisplayMessagePlugin ( props: GenericSqlPlugin ): DisplayMessagePlugin {
  return {
    accept: messageMatches ( props.beforeAfterRex ),
    display: <S extends any> ( { variables, who, state }: MessagePlugInParams<S> ) => {
      const sqlVariables = variables?.sql as any;
      return <BeforeAfterComponent regex={props.beforeAfterRex} state={state.state1 ()}>{rawSqlName => {
        const sqlName = rawSqlName.trim ().toLowerCase();
        const sql = props.sqlFn ( sqlVariables )
        let title = uppercaseFirstLetter ( rawSqlName );
        return <>
          <Typography style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px', marginTop: '8px', marginBottom: '8px' }}>
            <strong>{title} Sql</strong>
            <hr/>
            <strong>{sql}</strong>
          </Typography>
          <MessageButton label={"Show SQL details"} state={state.state2 ()} message={{ who, message: `[SqlData: ${sqlName}]` }}/>
          <MessageButton label={`${title} SQL`} state={state.state2 ()} message={{ who, message: `${title} Sql Pressed: please execute sql ${sql}` }}/>
        </>
      }
      }</BeforeAfterComponent>
    }
  }
}