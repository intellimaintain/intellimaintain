import { BeforeAfterComponent, DisplayMessagePlugin, MessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import { NameAnd } from "@laoban/utils";
import React, { ReactNode } from "react";
import { uppercaseFirstLetter } from "@intellimaintain/utils";
import { Typography } from "@mui/material";
import { Message } from "@intellimaintain/domain";


export interface GenericSqlPlugin {
  beforeAfterRex: RegExp
  sqlFn: ( v: NameAnd<any>, sqlName: string ) => string
  children?: ( text: string ) => ReactNode
}

export function genericSqlDisplayMessagePlugin ( props: GenericSqlPlugin ): DisplayMessagePlugin {
  return {
    accept: messageMatches ( props.beforeAfterRex ),
    display: <S extends any> ( { variables, who, state }: MessagePlugInParams<S> ) => {
      const sqlVariables = variables?.sql as any;
      return <BeforeAfterComponent regex={props.beforeAfterRex} state={state.state1 ()}>{rawSqlName => {
        const sqlName = rawSqlName.trim ().toLowerCase ();
        console.log ( 'sqlName', sqlName, sqlVariables )
        const sql = props.sqlFn ( sqlVariables, sqlName )
        console.log ( 'sql', sql )
        let title = uppercaseFirstLetter ( rawSqlName );
        let showSqlDetails: Message = { type: "message", who, message: `[SqlData: ${sqlName}]` };
        let executeSqlMsg: Message = { type: "message", who, message: `${title} Sql Pressed: please execute sql ${sql}` };
        return <>
          <Typography style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px', marginTop: '8px', marginBottom: '8px' }}>
            <strong>{title} Sql</strong>
            <hr/>
            <strong>{sql}</strong>
          </Typography>
          <MessageButton label={"Show SQL details"} state={state.state2 ()} message={showSqlDetails}/>
          <MessageButton label={`${title} SQL`} state={state.state2 ()} message={executeSqlMsg}/>
        </>
      }
      }</BeforeAfterComponent>
    }
  }
}
export const sqlDisplayMessagePlugin: DisplayMessagePlugin =
               genericSqlDisplayMessagePlugin ( {
                 beforeAfterRex: /^(.*?)\[(.*)Sql\](.*)$/,
                 sqlFn: ( sql, name ) => name && sql?.[ name ]?.sql?.toString () || ''
               } )




