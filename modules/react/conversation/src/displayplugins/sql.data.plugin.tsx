import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, MessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";
import { SqlDataAndTest } from "./SqlData";
import { Typography } from "@mui/material";

const beforeAndAfterRegex = /^(.*?)\[SqlData:([^\]]+)\](.*)$/;
export const sqlDataDisplayMessagePlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( { variables, who, state }: MessagePlugInParams<S> ) => {
    const sqlVariables = variables?.sql as any;
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state.state1()}>{rawSqlName => {
      const sqlName = rawSqlName.trim ();
      const sql = sqlVariables?.[ sqlName ]?.sql?.toString () || '';
      return <>
        <SqlDataAndTest variables={variables} sql={sql}>
          <MessageButton label={"Execute SQL"} state={state.state2 ()} message={{ who, message: `Execute Sql Pressed: please execute sql ${sql}` }}/>
        </SqlDataAndTest>
      </>
    }
    }</BeforeAfterComponent>
  }
}



