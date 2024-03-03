import { LensProps, LensProps2 } from "@focuson/state";
import { Conversation } from "@intellimaintain/domain";
import { SimpleTabPanel, SimpleTabPanelProps } from "@intellimaintain/components";
import React, { ReactElement } from "react";
import { toArray } from "@laoban/utils";
import { ConversationPlugin } from "./conversation.plugin";
import { SideEffect } from "@intellimaintain/react_core";

//The string defines which chat data to show. The any is where we store the temporary data it needs to display.


export interface DisplayChatAreaProps<S> extends LensProps2<S, Conversation, SideEffect[], any> {
  plugins: ConversationPlugin<S>[]
  def: ReactElement
}
export function DisplayChatArea<S> ( { state, plugins, def }: DisplayChatAreaProps<S> ) {
  const conversation = state.optJson1 ();
  const type = conversation?.chat?.type;
  const child = toArray ( plugins ).find ( c => c.type === type );
  return child ? child.chat ( state.focus1On ( 'chat' ) ) : def;
}