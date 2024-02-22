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

function extractVariablesSection ( markdown: string ): ErrorsAnd<string> {
  const variablesStart = markdown.indexOf ( '# Variables' );
  if ( variablesStart === -1 ) {
    // Variables section not found, throw an error or return empty string
    return []
  }
  const sectionStartRegex = /^#/m; // Matches any line that starts with #
  const restOfMarkdown = markdown.slice ( variablesStart + '# Variables'.length );
  const nextSectionStart = restOfMarkdown.search ( sectionStartRegex );

  return nextSectionStart === -1 ? restOfMarkdown.trim () : restOfMarkdown.slice ( 0, nextSectionStart ).trim ();
}

export function parseVariablesSection ( variablesContent: string ): ErrorsAnd<Variables> {
  const vars: NameAnd<string> = {};
  const errors: string[] = []
  const lines = variablesContent.split ( '\n' ).map ( ( line ) => line.trim () ).filter ( ( line ) => line.length > 0 );
  lines.forEach ( ( line, index ) => {
    const match = line.trim ().match ( /^\* (\w+): (.+)$/ );
    if ( match ) {
      const [ , varName, varValue ] = match;
      // Check if the variable name already exists to prevent duplicates
      if ( vars.hasOwnProperty ( varName ) )
        errors.push ( `Duplicate variable name "${varName}" found at line ${index + 1}. Each variable name must be unique.` );
      else
        vars[ varName ] = varValue;
    } else {
      errors.push ( `Variables Line ${index + 1} is malformed: "${line}". Expected format is "* varName: varValue".` );
    }
  } );

  return { variables: vars, errors };
}


export function extractVariablesFromMarkdown ( markdown: string ): ErrorsAnd<Variables> {
  try {
    console.log ( 'extractVariablesFromMarkdown', markdown )
    const variablesSection = extractVariablesSection ( markdown );
    if ( hasErrors ( variablesSection ) ) return { variables: {}, errors: variablesSection }
    return parseVariablesSection ( variablesSection );
  } catch ( e ) {
    return [ `Error ${e} extracting variables from\n${markdown}` ]
  }
}


