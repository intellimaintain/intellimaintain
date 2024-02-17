import { LensProps } from "@focuson/state";

export interface ChatState {
  msg: string[]
}
export interface ChatProps<S> extends LensProps<S, ChatState, any> {
  title: string
}

export function Chat<S> ( { state, title }: ChatProps<S> ) {
  const msgs = state.optJson ()?.msg || []
  return <div>
    <h1>{title}</h1>
    <ul>
      {msgs.map ( ( m, i ) => <li key={i}>{m}</li> )}
    </ul>
  </div>
}