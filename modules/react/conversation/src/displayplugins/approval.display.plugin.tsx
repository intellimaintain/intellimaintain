import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";

const beforeAndAfterRegex = /^(.*)\[(Approval)](.*)$/;
export const approvalDisplayPlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display:<S extends any> ( { variables, who, state,path }:MessagePlugInParams<S> ) => {
    const Approval: any = variables?.Approval
    const method = Approval?.method?.toString () || '<No Method>'
    const to = Approval?.to?.toString () || '<No To>'
    return <BeforeAfterComponent regex={beforeAndAfterRegex} state={state.state1()}>{during =>
      <HighlightedAndMessageButton state={state.state2 ()}
                                   buttonText="Request Approval"
                                   buttonMessage={{ who, message: `Please request approval` }}>
        <strong>{method}</strong>
        <hr/>
        To: {to}
        <hr/>
        Path: {path}
      </HighlightedAndMessageButton>}</BeforeAfterComponent>;
  }
}
