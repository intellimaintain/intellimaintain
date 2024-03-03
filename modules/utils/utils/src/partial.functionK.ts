import { Optional } from "@focuson/lens";

export type PartialFunctionK<From, To> = ( from: From ) => Promise<To | undefined>

export function composePartialFunctionK<From, To> ( ...fns: PartialFunctionK<From, To>[] ): PartialFunctionK<From, To> {
  return async ( from: From ) => {
    for ( let fn of fns ) {
      const result = await fn ( from )
      if ( result ) {
        return result
      }
    }
    return undefined
  }
}

export function optionalPfK<From, Data, To> ( optional: Optional<From, Data>, fn: ( d: Data | undefined ) => Promise<To> ): PartialFunctionK<From, To> {
  return async ( from: From ) => {
    const data = optional.getOption ( from )
    return fn ( data )
  }
}
export function optionalNotTherePfK<From, Data, To> ( optional: Optional<From, Data>, fn: () => To ): PartialFunctionK<From, To> {
  return async ( from: From ) => {
    const data = optional.getOption ( from )
    return data === undefined ? fn () : undefined
  }
}
