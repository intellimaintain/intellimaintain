import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";
import { SqlDataAndTest } from "./SqlData";

const beforeAndAfterRegex = /^(.*?)\[(CheckSql)\](.*)$/;
export const checkSqlDisplayMessagePlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( { variables, who, state }:MessagePlugInParams<S> ) => {
    const sql = variables?.sql as any;
    const checkSql = sql?.check?.sql?.toString () || '';
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state}>{_ =>
      <HighlightedAndMessageButton state={state.state2 ()}
                                   buttonText="Check SQL"
                                   buttonMessage={{ who, message: `Check Sql Pressed: please execute sql ${checkSql}` }}>
        <strong>{checkSql}</strong>
        <SqlDataAndTest variables={variables} sql={checkSql}/>
        {/*<pre>{JSON.stringify ( variables, null, 2 )}></pre>*/}
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
  }
}



