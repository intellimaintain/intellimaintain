import { isBadIdStoreResult } from "@intellimaintain/idstore";
import { SubCommandDetails } from "@intellimaintain/cli";
import { idStore } from "./id.store.cli";
import { defaultVariablesExtractor } from "@intellimaintain/defaultdomains";
import { extractVariablesFrom } from "@intellimaintain/variables";
import { YamlCapability } from "@intellimaintain/yaml";


export function addVariableCommands<Commander, Context, Config> ( yaml: YamlCapability ): SubCommandDetails<Commander, Context, Config> {
  return {
    cmd: 'variables',
    description: 'Allows checking how variables are extracted from artifacts',
    commands: [ {
      cmd: 'extract <id>', description: 'Gets the id from the id store and then extracts the variables from it',
      options: {
        '-i,--id <idroot>': { description: "The root of the id store", default: "ids" },
        '-p,--parser <parser>': { description: "What parser to use. 'json' and 'string' are common", default: "string" }
      },
      action: async ( commander, opts, id ) => {
        console.log ( `getting id  ${id} ${JSON.stringify ( opts )}` )
        let root = opts.id.toString ();

        const store = idStore ( root, yaml )
        const result = await store ( id, opts.parser.toString () )
        if ( isBadIdStoreResult ( (result) ) )
          console.log ( `Error ${result.error}` )
        else {
          const variables = extractVariablesFrom ( defaultVariablesExtractor ( yaml ), id, {}, result.result )
          console.log ( variables )
        }
      }
    } ]
  }
}
