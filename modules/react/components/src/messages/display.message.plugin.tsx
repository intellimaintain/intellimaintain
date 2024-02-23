import React, { ReactNode } from "react";
import { Typography } from "@mui/material";
import { Message } from "@intellimaintain/domain";
import { LensState2 } from "@focuson/state";
import { JSONObject } from "@intellimaintain/utils";
import { SideEffect } from "@intellimaintain/react_core";

export interface MessagePlugInParams<S> {
  variables: JSONObject
  who: string
  path: string
  state: LensState2<S, Message, SideEffect[], any>

}
export const messageMatches = ( regex: RegExp ) => ( message: Message | undefined, ): boolean =>
  message?.message.match ( regex ) !== null;
export interface DisplayMessagePlugin {
  accept: ( message: Message | undefined ) => boolean
  display: <S>( params: MessagePlugInParams<S> ) => ReactNode
}

export const defaultMessagePlugin: DisplayMessagePlugin = {
  accept: _ => true,
  display: ( { state } ) => {
    const message = state.json1 ( () => 'Message plug in error. No message' )
    return <Typography variant="subtitle1" color="textSecondary">{message.message}</Typography>;
  }
}

export function displayMessage<S> ( plugins: DisplayMessagePlugin[], variables: JSONObject, who: string, path: string, state: LensState2<S, Message, SideEffect[], any> ) {
  const plugin = plugins.find ( p => p.accept ( state.optJson1 () ) )
  const params: MessagePlugInParams<S> = { variables, who, path, state }
  return plugin?.display ( params ) ?? defaultMessagePlugin.display ( params )
}
