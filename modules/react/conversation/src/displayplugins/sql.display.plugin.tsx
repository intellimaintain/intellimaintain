import { BeforeAfterComponent, DisplayMessagePlugin, HighlightedAndMessageButton, messageMatches } from "@intellimaintain/components";
import React from "react";

const beforeAndAfterRegex = /^(.*)\[sql:([^\]]+)](.*)$/;
export const sqlDisplayPlugin: DisplayMessagePlugin = {
  accept: messageMatches ( beforeAndAfterRegex ),
  display: ( variables, who: string, s ) =>
    <BeforeAfterComponent regex={beforeAndAfterRegex} state={s}>{during =>
      <HighlightedAndMessageButton state={s.state2 ()}
                                   buttonText="Execute SQL"
                                   buttonMessage={{ who, message: `Check Sql Pressed: please execute sql ${during}` }}>
        <strong>{during}</strong>
      </HighlightedAndMessageButton>}</BeforeAfterComponent>
}
