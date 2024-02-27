import React, { ReactNode } from "react";
import { AttributeTable } from "@intellimaintain/components";
import { VariableDefn } from "@laoban/variables";
import { findSqlDataDetails, SqlDataDetails } from "@intellimaintain/defaultdomains";

export interface SqlDataProps {
  sql?: string
  variables: any
  children?: ReactNode
}


export interface SqlDataTableProps {
  details: SqlDataDetails
}
export function SqlDataTable ( { details }: SqlDataTableProps ) {

  const { environment, type, name, user, password, derefedSql, sql } = details
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
  const details = findSqlDataDetails ( sql || '', variables )
  return <><SqlDataTable details={details}/>
    <button>Test connection</button>
    {props.children}
  </>
}