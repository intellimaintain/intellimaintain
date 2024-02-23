import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";
import { SqlDataAndTest } from "./SqlData";

const beforeAndAfterRegex = /^(.*?)\[(ResolveSql)\](.*)$/;
export const resolveSqlDisplayMessagePlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( { variables, who, state }:MessagePlugInParams<S> ) => {
    const sql = variables?.sql as any;
    const resolveSql = sql?.resolve?.sql?.toString () || '';
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state}>{_ =>
      <HighlightedAndMessageButton state={state.state2 ()}
                                   buttonText="Resolve SQL"
                                   buttonMessage={{ who, message: `Resolve Sql Pressed: please execute sql ${resolveSql}` }}>
        <strong>{resolveSql}</strong>
        <SqlDataAndTest variables={variables}/>
        {/*<pre>{JSON.stringify ( variables, null, 2 )}></pre>*/}
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
  }
}



