import { LensState, LensState2 } from "@focuson/state";
import { BaseMessage, ChatDisplayData } from "@intellimaintain/domain";
import React from "react";
import { SideEffect } from "@intellimaintain/react_core";

export interface ConversationPlugin<S> {
  type: string;
  view: ( state: LensState<S, BaseMessage, any> ) => React.ReactElement
  chat: ( state: LensState2<S, ChatDisplayData<any>,SideEffect[], any> ) => React.ReactElement
}
