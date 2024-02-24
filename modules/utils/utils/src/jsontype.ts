import { toCamelCase } from "./strings";

export type JSONPrimitive = string | number | boolean | null;

export function isJsonPrimitive ( x: any ): x is JSONPrimitive {
  return typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean' || x === null;
}
// Define a recursive type for JSON objects and arrays
export type JSONObject = { [ key: string ]: JSONValue };
export type JSONArray = JSONValue[];

// Union type for any JSON value
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

export const transformKeys = ( fn: ( key: string ) => string ) => <T> ( jsonValue: any ): T => {
  if ( jsonValue === null || jsonValue===undefined || isJsonPrimitive ( jsonValue ) ) return jsonValue as T;
  if ( Array.isArray ( jsonValue ) ) return jsonValue.map ( transformKeys ( fn ) ) as T
  const transformedObject: JSONObject = {};
  Object.entries ( jsonValue ).forEach ( ( [ key, value ] ) => {
    const newKey = fn ( key );
    transformedObject[ newKey ] = transformKeys ( fn ) ( value );
  } );
  return transformedObject as T;
}
export const transformKeysToCamelCase = transformKeys ( toCamelCase );