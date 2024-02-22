import { isBadIdStoreResult } from "@intellimaintain/idstore";
import { SubCommandDetails } from "@intellimaintain/cli";
import { idStore } from "./id.store.cli";
import { defaultVariablesExtractor } from "@intellimaintain/defaultdomains";
import { extractVariablesFrom } from "@intellimaintain/variables";


export function addVariableCommands<Commander, Context, Config> (): SubCommandDetails<Commander, Context, Config> {
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

        const store = idStore ( root )
        const result = await store ( id, opts.parser.toString () )
        if ( isBadIdStoreResult ( (result) ) )
          console.log ( `Error ${result.error}` )
        else {
          const variables = extractVariablesFrom ( defaultVariablesExtractor, id, result.result )
          console.log ( variables )
        }
      }
    } ]
  }
}
