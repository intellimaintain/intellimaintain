export type EventStoreListener<S> = ( oldS: S, s: S, setJson: ( s: S ) => void ) => void
export type EventStoreModifier<S> = ( oldS: S, s: S ) => Promise<S>
export interface EventStore<S> {
  state: S
  debug?: boolean
  modifiers: EventStoreModifier<S>[]
  listeners: EventStoreListener<S>[]
}
export function eventStore<S> ( debug?: boolean ): EventStore<S> {
  return { state: undefined as S, listeners: [], modifiers: [], debug }
}

export function addEventStoreListener<S> ( container: EventStore<S>, listener: EventStoreListener<S> ) {
  container.listeners.push ( listener )
}
export function addEventStoreModifier<S> ( container: EventStore<S>, modifier: EventStoreModifier<S> ) {
  container.modifiers.push ( modifier )
}


export function setEventStoreValue<S> ( container: EventStore<S> ) {
  let setJson = ( s: S ): void => {
    const original = container.state
    if ( container.debug ) console.log ( 'setJsonForContainer - old state', container.state )
    if ( container.debug ) console.log ( 'setJsonForContainer - new state', s )
    // if ( count-- < 0 ) throw new Error('too many')
    if ( s === original ) {
      if ( container.debug ) console.log ( 'no change' )
      return
    } //no change
    container.state = s
    if ( container.debug ) console.log ( 'starting modifiers' )
    for ( const modifier of container.modifiers )
      modifier ( original, s ).then ( s => {
        if ( container.debug ) console.log ( 'modifier finished', s )
        if ( container.debug ) console.log ( 'setJson', setJson )
        setJson ( s )
      } )
    if ( container.debug ) console.log ( 'finished modifiers, starting listeners' )
    for ( const l of container.listeners )
      l ( original, s, setJson )
    if ( container.debug ) console.log ( 'finished  listeners' )
  };
  return setJson;
}


