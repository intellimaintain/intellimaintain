import { LensProps } from "@focuson/state";
import { Conversation } from "@intellimaintain/domain";
import { SimpleTabPanelProps, TabPanelDetails } from "@intellimaintain/components";
import React, { ReactNode } from "react";
import { toArray } from "@laoban/utils";

//The string defines which chat data to show. The any is where we store the temporary data it needs to display.


export interface DisplayConversation2Props<S> extends LensProps<S, Conversation, any> {
  def: ReactNode
  children:  React.ReactElement<SimpleTabPanelProps> | React.ReactElement<SimpleTabPanelProps>[] // i.e. we have a name and have a component
}
export function DisplayConversion2<S, C> ( { state, children, def }: DisplayConversation2Props<S> ) {
  const conversation = state.optJson ();
  const type = conversation?.chat?.type;
  const child = toArray(children).find ( c => c.props.title === type );
  return child ? child.props.children : def;
}
