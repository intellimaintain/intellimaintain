import { ErrorsAnd, mapK } from "@laoban/utils";
import { sendEvent, SendEvents } from "@intellimaintain/apiclienteventstore";
import { Event } from "@intellimaintain/events";
import { Lens } from "@focuson/lens";

export type SideEffectType = 'event'
export interface BaseSideeffect {
  command: SideEffectType
}


export interface EventSideEffect extends BaseSideeffect {
  command: 'event'
  event: Event
}
export function isEventSideEffect ( x: BaseSideeffect ): x is EventSideEffect {
  return x.command === 'event'
}

export type SideEffect = EventSideEffect

export interface HasSideeffects {
  sideeffects: SideEffect[]

}
export interface SideeffectResult<R> {
  sideeffect: BaseSideeffect
  result: ErrorsAnd<R>
}

export interface ISideEffectProcessor<S extends BaseSideeffect, R> {
  accept: ( s: BaseSideeffect ) => s is S
  process: ( s: S ) => Promise<ErrorsAnd<R>>
}

export function eventSideeffectProcessor ( es: SendEvents, path: string ): ISideEffectProcessor<EventSideEffect, boolean> {
  return {
    accept: isEventSideEffect,
    process: async ( s ) => {
      console.log ( 'sending event', s.event )
      await sendEvent ( es, s.event )
      return true
    }
  }
}

export const processSideEffect = ( processors: ISideEffectProcessor<SideEffect, any>[] ): ISideEffectProcessor<SideEffect, any> => ({
  accept: ( s: BaseSideeffect ): s is any => processors.find ( sp => sp.accept ( s ) ) !== undefined,
  process: async ( sideeffect: SideEffect ): Promise<ErrorsAnd<any>> => {
    for ( const p of processors )
      if ( p.accept ( sideeffect ) )
        return await p.process ( sideeffect )
    return [ `No processor for sideeffect ${sideeffect.command}` ]
  }
})


export const processSideEffectsInState = <S> ( sep: ISideEffectProcessor<SideEffect, any>, seLens: Lens<S, SideEffect[]>, logL: Lens<S, SideeffectResult<any>[]>, debug?: boolean ) =>
  async ( oldState: S, state: S, ) => {
    const sideeffects = seLens.getOption ( state ) || []
    if ( sideeffects.length === 0 ) {
      if ( debug ) console.log ( 'processSideEffectsInState', 'no sideeffects' )
      return state
    }
    if ( debug ) console.log ( 'processSideEffectsInState', 'sideeffects', sideeffects )
    const results: SideeffectResult<any>[] = await mapK ( sideeffects, async ( sideeffect ) => {
      let result = { sideeffect, result: await sep.process ( sideeffect ) };
      if ( debug ) console.log ( 'processSideEffectsInState', 'sideeffect result', result )
      return result;
    } )
    const existingLog = logL.getOption ( state ) || []
    const newLog = [ ...existingLog, ...results ]
    if ( debug ) console.log ( 'processSideEffectsInState', 'newLog', newLog )
    return seLens.set ( logL.set ( state, newLog ), [] )
  };
