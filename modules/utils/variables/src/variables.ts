import { deepCombineTwoObjects, ErrorsAnd, hasErrors, mapErrors, NameAnd, safeArray } from "@laoban/utils";
import { findIdKeyAndPath, IdAndName, JSONObject, SelectedAndList, toCamelCase } from "@intellimaintain/utils";

export type Variables = {
  variables: JSONObject
  errors: string[]

}
export type ExtractVariablesFn<T> = ( soFar: JSONObject, t: T ) => ErrorsAnd<Variables>

export type VariablesExtractor = NameAnd<ExtractVariablesFn<any>>

export function addVariables ( v: ErrorsAnd<Variables>, toAdd: NameAnd<string> ) {
  return mapErrors ( v, v => ({ variables: { ...v.variables, ...toAdd }, errors: v.errors }) )
}

export function extractVariablesFrom ( ve: VariablesExtractor, id: string, soFar: JSONObject, t: any ): Variables {
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

export function extractVariablesFromSelectedAndList<T extends IdAndName> ( ve: VariablesExtractor, context: string, soFar: JSONObject, se: SelectedAndList<T> ): Variables {
  function error ( msg: string ) {return { variables: {}, errors: [ msg ] } }
  if ( se.selected === undefined ) return error ( `No ${context} selected` )
  if ( se.item === undefined ) return error ( `No ${context} loaded (id is ${se.selected})` )
  console.log ( 'extractVariablesFromSelectedAndList', 'selected', se.selected, 'item', se.item )
  return extractVariablesFrom ( ve, se.selected, soFar, se.item )
}


export type ResultAccAndErrors = {
  result: NameAnd<Variables>
  acc: JSONObject
  errors: string[]

}
export function addManyVariablesFromSelectedAndList ( ve: VariablesExtractor, start: NameAnd<Variables>, toAdd: NameAnd<SelectedAndList<any>> ): ResultAccAndErrors {
  const errors: string[] = []
  let acc = {}
  Object.values ( start ).forEach ( v => {
    errors.push ( ...v.errors )
    acc = deepCombineTwoObjects ( acc, v.variables )
  } )

  const result: NameAnd<Variables> = { ...start }
  for ( let key in toAdd ) {
    let vars = extractVariablesFromSelectedAndList ( ve, key, acc, toAdd[ key ] );
    result[ key ] = vars
    errors.push ( ...safeArray ( vars.errors ) )
    acc = deepCombineTwoObjects ( acc, vars.variables )
  }
  return { result, acc, errors }
}


//This is mostly used for 'environment'. It gets all the name/values and then combines it with the child indexed by the key (e.g. environment)
//In this example section would be 'Environments' and key would be 'environment'
export function findRelevant ( soFar: NameAnd<string>, section: string, key: string, t: any ): NameAnd<string> {
  const foundKey = soFar[ key ] // now do we know what the environment is?
  console.log ( 'findRelevant', 'foundKey', key, foundKey )
  if ( foundKey === undefined ) return t
  const cleanedKey = toCamelCase ( foundKey )
  console.log ( 'findRelevant', 'cleanedKey', cleanedKey )
  const foundSection = t[ section ] // i.e. are there any 'Environments' in the t
  console.log ( 'findRelevant', 'foundSection', foundSection )
  if ( foundSection === undefined ) return t

  const foundRelevant = foundSection[ cleanedKey ] // look up the found environment in the Environments

  console.log ( 'findRelevant', 'foundRelevant', foundRelevant )
  let result = deepCombineTwoObjects ( t, foundRelevant );
  console.log ( 'findRelevant', 'result', result )
  return result
}
