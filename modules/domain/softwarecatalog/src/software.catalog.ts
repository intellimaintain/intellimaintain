import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin, IdAndName } from "@intellimaintain/domain";
import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { extractVariablesFromMarkdown, findRelevant, Variables } from "@intellimaintain/variables";
import { findIdKeyAndPath } from "@intellimaintain/idstore";

const yaml = require ( 'js-yaml' );

export interface SoftwareCatalog extends IdAndName, NameAnd<any> {
}

export function variablesFromSoftwareCatalog (soFar: NameAnd<any>, sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  const variables =  findRelevant ( soFar, 'Environments', 'Environment', sc )
  return { variables, errors: [] }
}

export const scMdParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const name = s.slice ( 0, index1 )
  const body = s.slice ( index1 + 1 )
  let softwareCatalog: SoftwareCatalog = { id, name, body }
  return softwareCatalog
}
export const scParser: ParserStoreParser = ( id, s ) => {
  const doc = yaml.load ( s )
  const { key, path: name } = findIdKeyAndPath ( id );
  return { id, name, ...doc }
}
export function softwareCatalogPlugin ( rootPath: string ): DomainPlugin<SoftwareCatalog> {
  return {
    prefix: 'sc',
    parser: scParser,
    variablesExtractor: variablesFromSoftwareCatalog,
    idStoreDetails: { extension: 'yaml', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}