import { defaultEventProcessor } from "@intellimaintain/events";
import { SubCommandDetails } from "@intellimaintain/cli";
import { defaultIdStoreDetails, defaultParserStore } from "@intellimaintain/defaultdomains";
import { isBadIdStoreResult, loadFromIdStore } from "@intellimaintain/idstore";
import { findListIds } from "@intellimaintain/listids";
import { findIdKeyAndPath } from "@intellimaintain/utils";
import { YamlCapability } from "@intellimaintain/yaml";


function getDetails ( root: string, yaml: YamlCapability ) {
  return defaultIdStoreDetails ( root, yaml, defaultParserStore ( yaml ) );
}
export const idStore = ( root: string, yaml: YamlCapability ) => loadFromIdStore ( getDetails ( root, yaml ) )

export const listIds = ( root: string, yaml: YamlCapability ) => findListIds ( getDetails ( root, yaml ) )


export const sep = ( root: string, yaml: YamlCapability ) => defaultEventProcessor ( 'start.', {}, idStore ( root, yaml ) )


export function idStoreCommands<Commander, Context, Config> ( yaml: YamlCapability ): SubCommandDetails<Commander, Context, Config> {
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
        const store = idStore ( opts.id.toString (), yaml )
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
          const store = getDetails ( opts.id.toString (), yaml )
          console.log ( Object.keys ( store.details ) )
        }
      },
      {
        cmd: 'list <idtype>', description: 'Lists the ids in the id store',
        options: {
          '-i,--id <idroot>': { description: "The root of the id store", default: "ids" }
        },
        action: async ( commander, opts, idtype ) => {
          const all = listIds ( opts.id.toString (), yaml )
          const ids = await all ( idtype )
          ids.forEach ( l => console.log ( l ) )
        }
      }
    ]
  }
}
