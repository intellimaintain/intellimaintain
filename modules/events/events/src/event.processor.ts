import { AppendEvent, BaseEvent, Event, EventNameAnd, SetIdEvent, SetValueEvent, ZeroEvent } from "./events";
import { defaultParserStore, ParserStore } from "./parserStore";
import { IdStore } from "./IdStore";
import { Lens, Lenses } from "@focuson/lens";

/** Why a promise? Because the IdEvent goes to the id store to get the data. The id store is async. */
export type EventProcessorFn<S, E extends BaseEvent> = ( p: EventProcessor<S>, event: E, s: S ) => Promise<S>

export type EventProcessorListener<S> = ( event: Event, startS: S, newS: S ) => void
export type PathToLensFn<S> = ( path: string ) => Lens<S, any>

export function pathToLens<S> (): PathToLensFn<S> {
  return path => {
    const parts = path.split ( '.' ).map ( p => p.trim () ).filter ( p => p.length > 0 )
    let lens: Lens<S, any> = Lenses.identity<S> ()
    for ( let part of parts ) {
      lens = lens.focusOn ( part as any )
    }
    return lens
  }
}
export interface EventProcessor<S> {
  zero: S
  processors: EventNameAnd<EventProcessorFn<S, any>> // too hard to properly express the type of the processors in Typescript
  listeners: EventProcessorListener<S>[]

  pathToLens: PathToLensFn<S>
  idStore: IdStore
}


export function defaultEventProcessor<S> ( zero: S, idStore: IdStore ): EventProcessor<S> {
  return {
    zero,
    processors: defaultProcessors<S> (),
    listeners: [],
    pathToLens: pathToLens<S> (),
    idStore
  }
}
export function addListener<S> ( processor: EventProcessor<S>, listener: EventProcessorListener<S> ): void {
  processor.listeners.push ( listener )
}

export function zeroEventProcessor<S> (): EventProcessorFn<S, ZeroEvent> {
  return async ( p ) => p.zero
}
export function setIdEventProcessor<S> (): EventProcessorFn<S, SetIdEvent> {
  return async ( p, e, s: S ) => {
    let value = await p.idStore ( e.id )
    let lens = p.pathToLens ( e.path )
    return lens.set ( s, value )
  }
}

export function setValueEventProcessor<S> (): EventProcessorFn<S, SetValueEvent> {
  return async ( p, e, s: S ) => {
    let lens = p.pathToLens ( e.path )
    return lens.set ( s, e.value )
  }
}
export function appendEventProcessor<S> (): EventProcessorFn<S, AppendEvent> {
  return async ( p, e, s: S ) => {
    let lens = p.pathToLens ( e.path )
    let value = lens.get ( s )
    if ( !Array.isArray ( value ) && value !== undefined && value !== null ) throw new Error ( `Cannot append to non array at ${e.path}. Value at that location is ${JSON.stringify(value)}` )
    return lens.set ( s, [ ...(value || []), e.value ] )
  }
}

export function defaultProcessors<S> (): EventNameAnd<EventProcessorFn<S, any>> {
  return {
    zero: zeroEventProcessor<S> (),
    setId: setIdEventProcessor<S> (),
    setValue: setValueEventProcessor<S> (),
    append: appendEventProcessor<S> ()
  }
}

export type EventProcessorResult<S> = {
  state?: S
  error?: string
}

export async function processEvent<S> ( processor: EventProcessor<S>, startState: S, e: Event ): Promise<EventProcessorResult<S>> {
  try {
    let processorFn: EventProcessorFn<S, any> = processor.processors[ e.event ]
    if ( !processorFn ) return { error: `No processor for event ${e.event}` }
    let result = await processorFn ( processor, e, startState );
    processor.listeners.forEach ( l => l ( e, startState, result ) )
    return result
  } catch ( e ) {
    return { error: e.message }
  }
}

export type EventProcessorError = {
  error: string
  event: Event
}
export type ErrorsAndS<S> = { errors: EventProcessorError[], state: S }
export async function processEvents<S> ( processor: EventProcessor<S>, baseState: S, events: Event[] ): Promise<ErrorsAndS<S>> {
  let state = baseState
  const errors: EventProcessorError[] = []
  for ( let e of events ) {
    const result = await processEvent ( processor, state, e )
    if ( result.error ) errors.push ( { error: result.error, event: e } )
    else
      state = result.state
  }
  return { errors, state }
}

