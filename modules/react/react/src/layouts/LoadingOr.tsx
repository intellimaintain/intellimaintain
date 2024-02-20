import { LensProps, LensState } from "@focuson/state";


export interface LoadingOrProps<S, T> extends LensProps<S, T | undefined, any> {
  children: ( state: LensState<S, T, any> ) => React.ReactElement
}
export function LoadingOr<S, T> ( { state, children }: LoadingOrProps<S, T> ) {
  const item = state.optJson ();
  return item === undefined ? <div>Loading...</div> : children ( state as LensState<S, T, any> );
}
