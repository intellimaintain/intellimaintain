import { ISideEffectProcessor, BaseSideeffect, SideeffectResult, SideEffect } from "../sideeffects/sideeffects";
import { Lens } from "@focuson/lens";
import { mapK } from "@laoban/utils";


export const processSideEffectsInState = <S> ( sep: ISideEffectProcessor<SideEffect, any>, seLens: Lens<S, SideEffect[]>, logL: Lens<S, SideeffectResult<any>[]>, debug?: boolean ) =>
  async (oldState: S,  state: S, ) => {
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