import { ErrorsAnd } from "@laoban/utils";

export interface BaseSideeffect {
  command: string
}

export interface SendMessageSideeffect extends BaseSideeffect {
  command: 'sendMessage'
  message: string
}
export type SideEffect = SendMessageSideeffect
export interface SideeffectResult<R> {
  sideeffect: BaseSideeffect
  result: ErrorsAnd<R>
}

export interface ISideEffectProcessor<S extends BaseSideeffect, R> {
  accept: ( s: BaseSideeffect ) => s is S
  process: ( s: S ) => Promise<ErrorsAnd<R>>
}

export const sendMessageSideeffectProcessor: ISideEffectProcessor<SendMessageSideeffect, boolean> = {
  accept: ( s: BaseSideeffect ): s is SendMessageSideeffect => s.command === 'sendMessage',
  process: async ( s ) => {
    console.log ( 'sending message', s.message )
    return true
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


