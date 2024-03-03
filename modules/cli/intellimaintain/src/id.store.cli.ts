import { defaultEventProcessor } from "@intellimaintain/events";
import { SubCommandDetails } from "@intellimaintain/cli";
import { defaultIdStoreDetails, defaultParserStore } from "@intellimaintain/defaultdomains";
import { isBadIdStoreResult, loadFromIdStore } from "@intellimaintain/idstore";
import { findListIds } from "@intellimaintain/listids";
import { findIdKeyAndPath } from "@intellimaintain/utils";


function getDetails ( root: string ) {
  return defaultIdStoreDetails ( root, defaultParserStore );
}
export const idStore = ( root: string ) => loadFromIdStore ( getDetails ( root ) )

export const listIds = ( root: string ) => findListIds ( getDetails ( root ) )


export const sep = ( root: string ) => defaultEventProcessor ( 'start.', {}, idStore ( root ) )


export function idStoreCommands<Commander, Context, Config> (): SubCommandDetails<Commander, Context, Config> {
  return {
    cmd: 'id',
    description: 'CId store commands',
    commands: [ {
      cmd: 'get <id>', description: 'Gets the id from the id store',
      options: {
        '-i,--id <idroot>': { description: "The root of the id store", default: "ids" },
        '-p,--parser <parser>': { description: "What parser to use. 'json' and 'string' are common. Default is defined by id tyoe" }
      },
      action: async ( commander, opts, id ) => {
        const store = idStore ( opts.id.toString () )
        const { key } = findIdKeyAndPath ( id )
        let parser = opts?.parser?.toString () || key;
        const result = await store ( id, parser )
        if ( isBadIdStoreResult ( (result) ) )
          console.log ( `Error ${result.error}` )
        else
          console.log ( JSON.stringify ( result.result, null, 2 ) )
      }
    },
      {
        cmd: 'types', description: 'Lists the ids in the id store',
        options: {
          '-i,--id <idroot>': { description: "The root of the id store", default: "ids" }
        },
        action: async ( commander, opts ) => {
          const store = getDetails ( opts.id.toString () )
          console.log ( Object.keys ( store.details ) )
        }
      },
      {
        cmd: 'list <idtype>', description: 'Lists the ids in the id store',
        options: {
          '-i,--id <idroot>': { description: "The root of the id store", default: "ids" }
        },
        action: async ( commander, opts, idtype ) => {
          const all = listIds ( opts.id.toString () )
          const ids = await all ( idtype )
          ids.forEach ( l => console.log ( l ) )
        }
      }
    ]
  }
}
