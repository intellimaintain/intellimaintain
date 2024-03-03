import { ErrorsAnd, NameAnd } from "@laoban/utils";
import { ParserStoreParser } from "@intellimaintain/parser";
import { DomainPlugin } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";
import { IdAndName, SelectedAndList } from "@intellimaintain/utils";


export interface Template extends IdAndName {
  template: string
}

export type Templates = SelectedAndList<Template>
export const templateParser: ParserStoreParser = ( id, template ): ErrorsAnd<Template> => {
  return { id, name: id, template }
}

export function variablesFromTemplate ( sofar: NameAnd<any>, template: Template ): ErrorsAnd<Variables> {
  let variables: NameAnd<any> = { id: template.id }
  return { variables, errors: [] }
}

export function templatePlugin ( rootPath: string ): DomainPlugin<Template> {
  return {
    prefix: 'template',
    parser: templateParser,
    variablesExtractor: variablesFromTemplate,
    idStoreDetails: { extension: 'txt', rootPath, mimeType: 'text/plain; charset=UTF-8' }
  }
}