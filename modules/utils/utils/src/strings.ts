export function lowercaseFirstLetter ( str: string ): string {
  return str.charAt ( 0 ).toLowerCase () + str.slice ( 1 );
}
export function uppercaseFirstLetter ( str: string ): string {
  return str.charAt ( 0 ).toUpperCase () + str.slice ( 1 );
}
export function toCamelCase ( str: string ): string {
  return str
    // First, handle the start of the string separately if it's uppercase
    .replace ( /^([A-Z])/, ( firstChar ) => firstChar.toLowerCase () )
    // Then, transform the rest of the string
    .replace ( /[^a-zA-Z0-9]+(.)/g, ( match, chr ) => chr.toUpperCase () );
}

export function escapeForSql ( str: string ): string {
  // Replace single quotes with two single quotes for SQL escaping
  return str.replace ( /'/g, "''" );
}

export interface HasEscape {
  escape?: boolean;
}
export function escapeSqlParameters ( sql: string, lookupMap: Record<string, HasEscape> ): string {
  // Regular expression to find all instances of `:parameterName`
  const parameterRegex = /:([\w.]+)/g;

  if (lookupMap === undefined) throw new Error('lookupMap is undefined');
  // Replace function to handle each match
  const replacer = ( match: string, paramName: string ): string => {
    // Check if the parameter needs quotes
    if ( lookupMap[ paramName ]?.escape ) {
      // Add quotes around the parameter placeholder
      return `'${match}'`;
    } else {
      // Leave the parameter placeholder as is
      return match;
    }
  };

  // Replace each parameter in the SQL string according to the lookup map
  return sql?.replace ( parameterRegex, replacer );
}


export function extractSqlString ( query?: string ): string[] {
  if ( !query ) return [];

  // Regular expression to match parameters (including those with dots)
  const parameterRegex = /:([a-zA-Z0-9._]+)/g;
  let match: RegExpExecArray | null;
  const parameters: string[] = [];

  // Use a loop to find all matches in the query string
  while ( (match = parameterRegex.exec ( query )) !== null ) {
    // Add the matched parameter name to the list, excluding the leading colon
    parameters.push ( match[ 1 ] );
  }

  return parameters;
}
