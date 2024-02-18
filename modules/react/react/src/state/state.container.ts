//  This is basically the redux container. We put a state in it. When it changes we re-render the component.
//The usual way to change it is from gui components with state.setJson()
//But sideeffects can do it too (potentially in the future) and we need to watch the file system for our messages and messages will change it

import { processSideEffectsInState } from "./state2Sideeffects";

export type StateListener<S> = ( s: S, setJson: ( s: S ) => void ) => void
export type StateModifier<S> = ( s: S ) => Promise<S>
export interface StateContainer<S> {
  state: S
  modifiers: StateModifier<S>[]
  listeners: StateListener<S>[]
}
export function stateContainer<S> (): StateContainer<S> {
  return { state: undefined as S, listeners: [], modifiers: [] }
}

export function addStateContainerListener<S> ( container: StateContainer<S>, listener: StateListener<S> ) {
  container.listeners.push ( listener )
}
export function addStateContainerModifier<S> ( container: StateContainer<S>, modifier: StateModifier<S> ) {
  container.modifiers.push ( modifier )
}

// let count = 30
export function setJsonForContainer<S> ( container: StateContainer<S> ) {
  let setJson = ( s: S ): void => {
    console.log ( 'setJsonForContainer - old state', container.state )
    console.log ( 'setJsonForContainer - new state', s )
    // if ( count-- < 0 ) throw new Error('too many')
    if ( s === container.state ) {
      console.log('no change')
      return} //no change
    container.state = s
    console.log ( 'starting modifiers' )
    for ( const modifier of container.modifiers )
      modifier ( s ).then ( s =>{
        console.log ( 'modifier finished', s )
        console.log ( 'setJson', setJson )
        setJson ( s )
      } )
    console.log ( 'finished modifiers, starting listeners' )
    for ( const l of container.listeners )
      l ( s, setJson )
    console.log ( 'finished  listeners' )
  };
  return setJson;
}


