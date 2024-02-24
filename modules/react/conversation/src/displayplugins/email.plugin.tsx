import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";
import { derefence, dollarsBracesVarDefn } from "@laoban/variables";

const beforeAndAfterRegex = /^(.*)\[Email (approval)](.*)$/;
export const emailDisplayPlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( { variables, who, state, path, template }: MessagePlugInParams<S> ) => {
    const Approval: any = variables?.approval
    const method = Approval?.method?.toString () || '<No Method>'
    const to = Approval?.to?.toString () || '<No To>'
    console.log ( 'varaibles', variables );
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state.state1 ()}>{during => {
      const t = template ( state.main, 'email' )
      return <HighlightedAndMessageButton state={state.state2 ()}
                                          buttonText="Request Approval"
                                          buttonMessage={{ who, message: `Please request approval` }}>
        <strong>{method}</strong>
        <hr/>
        To: {to}
        <hr/>
        <pre>{derefence ( 'email.plugin', variables, t, { variableDefn: dollarsBracesVarDefn, emptyTemplateReturnsSelf: true } )}</pre>
      </HighlightedAndMessageButton>;
    }}</BeforeAfterComponent>;
  }
}
