import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches } from "@intellimaintain/components";
import { Message } from "@intellimaintain/domain";
import React from "react";
import { LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { JSONObject } from "@intellimaintain/utils";
import { SqlData, SqlDataAndTest } from "./SqlData";

const beforeAndAfterRegex = /^(.*?)\[(ResolveSql)\](.*)$/;
export const resolveSqlDisplayMessagePlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( variables: JSONObject, who: string, s: LensState2<S, Message, SideEffect[], any> ) => {
    const sql = variables?.sql as any;
    const resolveSql = sql?.resolve?.sql?.toString () || '';
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={s}>{_ =>
      <HighlightedAndMessageButton state={s.state2 ()}
                                   buttonText="Resolve SQL"
                                   buttonMessage={{ who, message: `Resolve Sql Pressed: please execute sql ${resolveSql}` }}>
        <strong>{resolveSql}</strong>
        <SqlDataAndTest variables={variables}/>
        {/*<pre>{JSON.stringify ( variables, null, 2 )}></pre>*/}
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
  }
}



