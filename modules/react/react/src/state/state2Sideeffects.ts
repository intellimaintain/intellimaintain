import { ISideEffectProcessor, BaseSideeffect, SideeffectResult } from "../sideeffects/sideeffects";
import { Lens } from "@focuson/lens";
import { mapK } from "@laoban/utils";


export const processSideEffectsInState = <S, C> ( sep: ISideEffectProcessor<BaseSideeffect, any>, seLens: Lens<S, BaseSideeffect[]>, logL: Lens<S, SideeffectResult<any>[]> ) =>
  async ( state: S, ) => {
    const sideeffects = seLens.getOption ( state ) || []
    const results: SideeffectResult<any>[] = await mapK ( sideeffects, async ( sideeffect ) =>
      ({ sideeffect, result: await sep.process ( sideeffect ) }) )
    const existingLog = logL.getOption ( state ) || []
    const newLog = [ ...existingLog, ...results ]
    return seLens.set ( logL.set ( state, newLog ), [] )
  };