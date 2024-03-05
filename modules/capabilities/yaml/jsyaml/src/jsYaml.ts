import { YamlCapability } from "@intellimaintain/yaml";
import { ErrorsAnd } from "@laoban/utils";

const js = require ( 'js-yaml' );

export function jsyamlParser ( s: string ): ErrorsAnd<any> {
  try {
    return js.load ( s )
  } catch ( e: any ) {
    return [ e.toString () ]
  }
}
export function jsyamlWriter ( content: any ): ErrorsAnd<string> {
  try {
    return js.dump ( content )
  } catch ( e: any ) {
    return [ e.toString () ]
  }
}

export function jsYaml (): YamlCapability {
  return {
    parser: jsyamlParser,
    writer: jsyamlWriter
  } as YamlCapability
}