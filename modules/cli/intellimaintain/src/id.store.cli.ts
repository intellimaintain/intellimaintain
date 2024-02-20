import { defaultEventProcessor } from "@intellimaintain/events";
import { defaultIdStoreDetails, loadFromIdStore } from "@intellimaintain/idstore";
import { SubCommandDetails } from "@intellimaintain/cli";

export const idStore = ( root: string ) => loadFromIdStore ( defaultIdStoreDetails ( root ) );
export const sep = ( root: string ) => defaultEventProcessor ( 'start.', {}, idStore ( root ) )


export function idStoreCommands<Commander, Context, Config> (): SubCommandDetails<Commander, Context, Config> {
  return {
    cmd: 'id',
    description: 'CId store commands',
    commands: [ {
      cmd: 'get <id>', description: 'Gets the id from the id store',
      options: { '-i,--id <idroot>': { description: "The root of the id store", default: "." } },
      action: async ( commander, opts, id ) => {
        console.log ( `getting id  ${id} ${JSON.stringify ( opts )}` )
        const store = idStore ( opts.idroot.toString () )
        const result = await store ( id )
        console.log ( JSON.stringify ( result, null, 2 ) )
      }
    } ]
  }
}
