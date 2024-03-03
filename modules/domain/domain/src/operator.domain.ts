import { ParserStoreParser } from "@intellimaintain/parser";
import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { transformKeysToCamelCase } from "@intellimaintain/utils";
import { Variables } from "@intellimaintain/variables";
import { DomainPlugin } from "./domain.plugin";

const yaml = require ( 'js-yaml' );

export interface Operator {
  name: string
  email: string
}

export const operatorParser: ParserStoreParser = ( id, s ): ErrorsAnd<Operator> => {
  const doc = transformKeysToCamelCase<any> ( yaml.load ( s ) )
  return { id, ...doc }
}

export function variablesFromOperator ( sofar: NameAnd<any>,operator: Operator ): ErrorsAnd<Variables> {
  return { variables: operator as any, errors: [] }
}

export function operatorPlugin ( rootPath: string ): DomainPlugin<Operator> {
  return {
    prefix: 'operator',
    parser: operatorParser,
    variablesExtractor: variablesFromOperator,
    idStoreDetails: { extension: 'yaml', rootPath, mimeType: 'text/yaml; charset=UTF-8' }
  }
}
