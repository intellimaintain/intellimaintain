import { ErrorsAnd } from "@laoban/utils";
import { sendEvent, SendEvents } from "@intellimaintain/apiclienteventstore";
import { Event } from "@intellimaintain/events";

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


