import { deepCombineTwoObjects, ErrorsAnd, hasErrors, NameAnd } from "@laoban/utils";
import { findIdKeyAndPath } from "@intellimaintain/idstore";
import { isJsonPrimitive, JSONObject } from "@intellimaintain/utils";

export type Variables = {
  variables: NameAnd<string>
  errors: string[]

}
export type ExtractVariablesFn<T> = ( soFar: NameAnd<string>, t: T ) => ErrorsAnd<Variables>

export type VariablesExtractor = NameAnd<ExtractVariablesFn<any>>


export function extractVariablesFrom ( ve: VariablesExtractor, id: string, soFar: NameAnd<string>, t: any ): Variables {
  try {
    const { key } = findIdKeyAndPath ( id );
    const v = ve[ key ]
    if ( v === undefined )
      return { variables: {}, errors: [ `No extractor for idtype ${key} in id ${id} . Legal values are ${Object.keys ( ve ).join ( ', ' )}` ] }
    let result: ErrorsAnd<Variables> = v ( soFar, t );
    if ( hasErrors ( result ) ) return { variables: {}, errors: result }
    return result
  } catch ( e ) {
    return { variables: {}, errors: [ e.message ] }
  }
}

export function addToResultRecursively ( prefix: string, result: NameAnd<string>, t: any ) {
  if ( typeof t !== 'object' ) return {}
  Object.entries ( t ).filter ( ( [ k, v ] ) => isJsonPrimitive ( v ) ).forEach ( ( [ key, value ] ) => {
    result[ prefix + key ] = value.toString ()
  } )
  Object.entries ( t ).filter ( ( [ k, v ] ) => typeof v === 'object' ).forEach ( ( [ k, v ] ) =>
    addToResultRecursively ( prefix + k + '.', result, v ) )
}
export function toVariables ( t: any ) {
  let result: NameAnd<string> = {}
  addToResultRecursively ( '', result, t )
  return result

}
//This is mostly used for 'environment'. It gets all the name/values and then combines it with the child indexed by the key (e.g. environemnt)
//In this example section would be 'Environments' and key would be 'environment'
export function findRelevant ( soFar: NameAnd<string>, section: string, key: string, t: any ): NameAnd<string> {
  const foundKey = soFar[ key ] // now do we know what the environment is?
  console.log ( 'findRelevant', 'foundKey', key, foundKey )
  if ( foundKey === undefined ) return toVariables ( t )

  const foundSection = t[ section ] // i.e. are there any 'Environments' in the t
  console.log ( 'findRelevant', 'foundSection', foundSection )
  if ( foundSection === undefined ) return toVariables ( t )

  const foundRelevant = foundSection[ foundKey ] // look up the found environment in the Environments
  const withoutSection = { ...t, [ section ]: {} }

  console.log ( 'findRelevant', 'foundRelevant', foundRelevant )
  let result = deepCombineTwoObjects ( toVariables ( withoutSection ), toVariables ( foundRelevant ) );
  console.log ( 'findRelevant', 'result', result )
  return result
}
