import { Variables, VariablesExtractor } from "@intellimaintain/variables";
import { ErrorsAnd, hasErrors, NameAnd } from "@laoban/utils";
import { KnowledgeArticle, SoftwareCatalog, Ticket } from "@intellimaintain/domain";

function extractVariablesSection ( markdown: string ): ErrorsAnd<string> {
  const variablesStart = markdown.indexOf ( '# Variables' );
  if ( variablesStart === -1 ) {
    // Variables section not found, throw an error or return empty string
    return [ `Variables section not found in markdown.` ]
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

export function variablesFromTicket ( t: Ticket ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( t.description )
}
export function variablesFromKnowledgeArticle ( ka: KnowledgeArticle ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( ka.body )
}
export function variablesFromSoftwareCatalog ( sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  return extractVariablesFromMarkdown ( sc.body )
}
export const defaultVariablesExtractor: VariablesExtractor = {
  ka: variablesFromKnowledgeArticle,
  ticket: variablesFromTicket,
  sc: variablesFromSoftwareCatalog
}