import { defaultEventProcessor } from "@intellimaintain/events";
import { SubCommandDetails } from "@intellimaintain/cli";
import { defaultIdStoreDetails, defaultParserStore } from "@intellimaintain/domainvariables";
import { isBadIdStoreResult, loadFromIdStore } from "@intellimaintain/idstore";

export const idStore = ( root: string ) => loadFromIdStore ( defaultIdStoreDetails ( root, defaultParserStore ) );
export const sep = ( root: string ) => defaultEventProcessor ( 'start.', {}, idStore ( root ) )


export function idStoreCommands<Commander, Context, Config> (): SubCommandDetails<Commander, Context, Config> {
  return {
    cmd: 'id',
    description: 'CId store commands',
    commands: [ {
      cmd: 'get <id>', description: 'Gets the id from the id store',
      options: {
        '-i,--id <idroot>': { description: "The root of the id store", default: "ids" },
        '-p,--parser <parser>': { description: "What parser to use. 'json' and 'string' are common", default: "string" }
      },
      action: async ( commander, opts, id ) => {
        console.log ( `getting id  ${id} ${JSON.stringify ( opts )}` )
        const store = idStore ( opts.id.toString () )
        const result = await store ( id, opts.parser.toString () )
        if ( isBadIdStoreResult ( (result) ) )
          console.log ( `Error ${result.error}` )
        else
          console.log ( result.result )
      }
    } ]
  }
}
