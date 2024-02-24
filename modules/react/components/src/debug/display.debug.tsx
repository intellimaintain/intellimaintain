import React from "react";
import { LensProps } from "@focuson/state";
import { DisplayJson } from "../displayRaw/display.json";

export interface DisplayDebugProps<S> extends LensProps<S, any, any> {
  maxHeight: string
  maxWidth: string
}


export function DisplayDebug<S> ( { state, maxHeight, maxWidth }: DisplayDebugProps<S> ) {
  return <DisplayJson maxWidth={maxWidth} maxHeight={maxHeight} json={state.optJson ()}/>
}
export function StateDisplay<S> ( { state, maxHeight, maxWidth }: DisplayDebugProps<S> ) {
  return <DisplayJson maxWidth={maxWidth} maxHeight={maxHeight} json={state.main}/>
}
