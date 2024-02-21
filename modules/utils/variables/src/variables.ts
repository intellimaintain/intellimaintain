import { ErrorsAnd, hasErrors, NameAnd } from "@laoban/utils";
import { findIdKeyAndPath } from "@intellimaintain/idstore";

export type Variables = {
  variables: NameAnd<string>
  errors: string[]

}
export type ExtractVariablesFn<T> = ( t: T ) => ErrorsAnd<Variables>

export type VariablesExtractor = NameAnd<ExtractVariablesFn<any>>



export function extractVariablesFrom ( ve: VariablesExtractor, id: string, t: any ): Variables {
  try {
    const { key } = findIdKeyAndPath ( id );
    const v = ve[ key ]
    if ( v === undefined )
      return { variables: {}, errors: [ `No extractor for idtype ${key} in id ${id} . Legal values are ${Object.keys ( ve ).join ( ', ' )}` ] }
    let result: ErrorsAnd<Variables> = v ( t );
    if ( hasErrors ( result ) ) return { variables: {}, errors: result }
    return result
  } catch ( e ) {
    return { variables: {}, errors: [ e.message ] }
  }
}

