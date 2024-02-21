export type JSONPrimitive = string | number | boolean | null;

// Define a recursive type for JSON objects and arrays
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

// Union type for any JSON value
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

