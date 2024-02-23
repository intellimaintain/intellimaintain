import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches } from "@intellimaintain/components";
import { Message } from "@intellimaintain/domain";
import React from "react";
import { LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { JSONObject } from "@intellimaintain/utils";

const beforeAndAfterRegex = /^(.*?)\[(CheckSql)\](.*)$/;
export const checkSqlDisplayMessagePlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( variables: JSONObject, who: string, s: LensState2<S, Message, SideEffect[], any> ) => {
    const sql = variables?.sql as any;
    const checkSql = sql?.check?.sql?.toString () || '';
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={s}>{_ =>
      <HighlightedAndMessageButton state={s.state2 ()}
                                   buttonText="Check SQL"
                                   buttonMessage={{ who, message: `Check Sql Pressed: please execute sql ${checkSql}` }}>
        <strong>{checkSql}</strong>
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
  }
}



