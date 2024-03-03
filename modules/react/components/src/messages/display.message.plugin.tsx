import React, { ReactNode } from "react";
import { Typography } from "@mui/material";
import { BaseMessage, isMessage } from "@intellimaintain/domain";
import { LensState2 } from "@focuson/state";
import { JSONObject } from "@intellimaintain/utils";
import { SideEffect } from "@intellimaintain/react_core";

export type TemplateFn<S> = ( state: S, templateName: string ) => string
export interface MessagePlugInParams<S> {
  variables: JSONObject
  who: string
  path: string
  state: LensState2<S, BaseMessage, SideEffect[], any>
  template: TemplateFn<S>

}
export const messageMatches = ( regex: RegExp ) => ( message: BaseMessage | undefined, ): boolean =>
  isMessage ( message ) && message?.message.match ( regex ) !== null;
export interface DisplayMessagePlugin {
  accept: ( message: BaseMessage | undefined ) => boolean
  display: <S>( params: MessagePlugInParams<S> ) => ReactNode
}

export const defaultMessagePlugin: DisplayMessagePlugin = {
  accept: _ => true,
  display: ( { state } ) => {
    const message = state.json1 ( () => 'Message plug in error. No message' )
    if ( !isMessage ( message ) ) return <Typography variant="subtitle1" color="textSecondary">Message plug in error. Not message {JSON.stringify ( message )}</Typography>
    return <Typography variant="subtitle1" color="textSecondary">{message.message}</Typography>;
  }
}

export function displayMessage<S> ( plugins: DisplayMessagePlugin[], variables: JSONObject, who: string, path: string, state: LensState2<S, BaseMessage, SideEffect[], any>, template: ( state: S, templateName: string ) => string ) {
  const plugin = plugins.find ( p => p.accept ( state.optJson1 () ) )
  const params: MessagePlugInParams<S> = { variables, who, path, state, template }
  return plugin?.display ( params ) ?? defaultMessagePlugin.display ( params )
}
