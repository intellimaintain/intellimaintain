import React, { ReactNode } from "react";
import { Typography } from "@mui/material";
import { Message } from "@intellimaintain/domain";
import { LensState2 } from "@focuson/state";
import { JSONObject } from "@intellimaintain/utils";
import { SideEffect } from "@intellimaintain/react_core";

export const messageMatches = ( regex: RegExp ) => ( message: Message | undefined, ): boolean =>
  message?.message.match ( regex ) !== null;
export interface DisplayMessagePlugin {
  accept: ( message: Message | undefined ) => boolean
  display: <S>( variables: JSONObject, who: string, s: LensState2<S, Message, SideEffect[], any> ) => ReactNode
}

export const defaultMessagePlugin: DisplayMessagePlugin = {
  accept: _ => true,
  display: ( variables, who: string, s ) => {
    const message = s.json1 ( () => 'Message plug in error. No message' )
    return <Typography variant="subtitle1" color="textSecondary">{message.message}</Typography>;
  }
}

export function displayMessage<S> ( plugins: DisplayMessagePlugin[], variables: JSONObject, who: string, s: LensState2<S, Message, SideEffect[], any> ) {
  const plugin = plugins.find ( p => p.accept ( s.optJson1 () ) )
  return plugin?.display ( variables, who, s ) ?? defaultMessagePlugin.display ( variables, who, s )
}
