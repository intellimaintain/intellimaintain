import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin, } from "@intellimaintain/domain";
import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { findRelevant, Variables } from "@intellimaintain/variables";
import { findIdKeyAndPath, IdAndName, SelectedAndList, transformKeysToCamelCase } from "@intellimaintain/utils";
import { DatabaseAndEnvironments } from "./database.config";

const yaml = require ( 'js-yaml' );

export interface SoftwareCatalog extends IdAndName, NameAnd<any>, DatabaseAndEnvironments {
}
export type SoftwareCatalogs = SelectedAndList<SoftwareCatalog>
export function variablesFromSoftwareCatalog ( soFar: NameAnd<any>, sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  const variables = findRelevant ( soFar, 'environments', 'environment', sc )
  return { variables, errors: [] }
}

export const scParser: ParserStoreParser = ( id, s ) => {
  let input = yaml.load ( s );
  const doc = transformKeysToCamelCase<any> ( input )
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