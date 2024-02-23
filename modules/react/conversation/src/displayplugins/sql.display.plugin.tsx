import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches, MessagePlugInParams } from "@intellimaintain/components";
import React from "react";

const beforeAndAfterRegex = /^(.*)\[sql:([^\]]+)](.*)$/;
export const sqlDisplayPlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: <S extends any> ( {  who, state }:MessagePlugInParams<S> ) =>
    <BeforeAfterComponent regex={beforeAndAfterRegex} state={state}>{during =>
      <HighlightedAndMessageButton state={state.state2 ()}
                                   buttonText="Execute SQL"
                                   buttonMessage={{ who, message: `Check Sql Pressed: please execute sql ${during}` }}>
        <strong>{during}</strong>
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
}
