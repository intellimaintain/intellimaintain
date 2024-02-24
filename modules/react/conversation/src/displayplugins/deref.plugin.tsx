import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import { Message } from "@intellimaintain/domain";
import React from "react";
import { LensState2 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { JSONObject } from "@intellimaintain/utils";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";

const beforeAndAfterRegex = /^(.*?)\[Deref:([^\]]+)](.*)$/;
export const dereferencePlugIn: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( { variables, who, state } :MessagePlugInParams<S>) => {
    const sql = variables?.sql as any;
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state.state1()}>{string => {
      const message: Message = { who, message: derefence ( 'Variable Plugin', variables, string, { variableDefn: dollarsBracesVarDefn } ) }
      return <HighlightedAndMessageButton state={state.state2 ()}
                                          buttonText="Dereference string"
                                          buttonMessage={message}>
        <strong>{string}</strong>
        <hr/>
        <strong>{message.message}</strong><br/>
      </HighlightedAndMessageButton>
    }}</BeforeAfterComponent>
  }
}



