import { LensProps } from "@focuson/state";
import { SideeffectResult } from "../sideeffects/sideeffects";


export function DisplayDebug<S> ( { state }: LensProps<S, any, any> ) {
  return <pre>{JSON.stringify ( state.optJson()||{}, null, 2 )}</pre>
}
export function StateDisplay<S> ( { state }: LensProps<S, any, any> ) {
  return <pre>{JSON.stringify ( state.main, null, 2 )}</pre>
}
export function LogDisplay<S> ( { state }: LensProps<S, SideeffectResult<any>[], any> ) {
  return <pre>{JSON.stringify ( state.optJson()||{}, null, 2 )}</pre>
}