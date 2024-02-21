import { LensProps } from "@focuson/state";
import { SideeffectResult } from "../sideeffects/sideeffects";
import { DisplayJson } from "../components/display.json";

export function DisplayDebug<S> ( { state }: LensProps<S, any, any> ) {
  return <DisplayJson json={state.optJson ()} maxHeight='40vh'/>
}
export function StateDisplay<S> ( { state }: LensProps<S, any, any> ) {
  return <DisplayJson json={state.main} maxHeight='40vh'/>
}
export function LogDisplay<S> ( { state }: LensProps<S, SideeffectResult<any>[], any> ) {
  return <DisplayJson json={state.optJson ()} maxHeight='40vh'/>
}