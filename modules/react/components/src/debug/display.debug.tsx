import React from "react";
import { LensProps } from "@focuson/state";
import { DisplayJson } from "../displayRaw/display.json";



export function DisplayDebug<S> ( { state }: LensProps<S, any, any> ) {
  return <DisplayJson json={state.optJson ()} maxHeight='40vh'/>
}
export function StateDisplay<S> ( { state }: LensProps<S, any, any> ) {
  return <DisplayJson json={state.main} maxHeight='40vh'/>
}
