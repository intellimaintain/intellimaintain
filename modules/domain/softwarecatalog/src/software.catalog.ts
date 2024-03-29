import { ParserStoreParser } from "@intellimaintain/parser";
import { camelCaseAndIdAndNameParser, DomainPlugin, } from "@intellimaintain/domain";
import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { findRelevant, Variables } from "@intellimaintain/variables";
import { findIdKeyAndPath, IdAndName, SelectedAndList, transformKeysToCamelCase } from "@intellimaintain/utils";
import { DatabaseAndEnvironments } from "./database.config";
import { YamlCapability } from "@intellimaintain/yaml";
import { Simulate } from "react-dom/test-utils";
import input = Simulate.input;

const yaml = require ( 'js-yaml' );

export interface SoftwareCatalog extends IdAndName, NameAnd<any>, DatabaseAndEnvironments {
}
export type SoftwareCatalogs = SelectedAndList<SoftwareCatalog>
export function variablesFromSoftwareCatalog ( soFar: NameAnd<any>, sc: SoftwareCatalog ): ErrorsAnd<Variables> {
  const variables = findRelevant ( soFar, 'environments', 'environment', sc )
  return { variables, errors: [] }
}

// export const scParser = ( yaml: YamlCapability ): ParserStoreParser => ( id, s ) => {
//   return mapErrors ( yaml.parser ( s ), input => {
//     const doc = transformKeysToCamelCase<any> ( input )
//     const { key, path: name } = findIdKeyAndPath ( id );
//     return { id, name, ...doc }
//   } )
// }
export function softwareCatalogPlugin ( yaml: YamlCapability, rootPath: string ): DomainPlugin<SoftwareCatalog> {
  return {
    prefix: 'sc',
    parser: camelCaseAndIdAndNameParser ( yaml ),
    writer: yaml.writer,
    variablesExtractor: variablesFromSoftwareCatalog,
    idStoreDetails: { extension: 'yaml', rootPath, mimeType: 'text/markdown; charset=UTF-8' }
  }
}