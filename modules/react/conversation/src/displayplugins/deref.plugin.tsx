import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches } from "@intellimaintain/components";
import { Message } from "@intellimaintain/domain";
import React from "react";
import { LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { JSONObject } from "@intellimaintain/utils";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";

const beforeAndAfterRegex = /^(.*?)\[Deref:([^\]]+)](.*)$/;
export const dereferencePlugIn: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( variables: JSONObject, who: string, s: LensState2<S, Message, SideEffect[], any> ) => {
    const sql = variables?.sql as any;
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={s}>{string => {
      const message: Message = { who, message: derefence ( 'Variable Plugin', variables, string, { variableDefn: dollarsBracesVarDefn } ) }
      return <HighlightedAndMessageButton state={s.state2 ()}
                                          buttonText="Dereference string"
                                          buttonMessage={message}>
        <strong>{string}</strong><hr />
        <strong>{message.message}</strong><br />
      </HighlightedAndMessageButton>
    }}</BeforeAfterComponent>
  }
}



