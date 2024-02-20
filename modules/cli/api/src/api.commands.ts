import { CommandFn, HasCurrentDirectory } from "@intellimaintain/cli";
import { startKoa } from "@runbook/koa";
import { wizardOfOzApiHandlers } from "./api";
import { defaultIdStoreDetails, loadFromIdStore } from "@intellimaintain/idstore";
import { defaultParserStore } from "@intellimaintain/domain";


export function apiCommand<Commander, Context extends HasCurrentDirectory, Config> (): CommandFn<Commander, Context, Config> {
  return ( context, config ) => ({
    cmd: 'api ',
    description: 'Runs the api that supports the Wizard Of Oz',
    options: {
      '-d, --directory <directory>': { description: 'The directory that files are served from', default: context.currentDirectory },
      '-p, --port <port>': { description: 'Port to run the server on', default: "1235" },
      '--debug': { description: 'More debug information ' },
      '-i,--id <idroot>': { description: "The root of the id store", default: "ids" }
    },
    action: async ( commander, opts ) => {
      const { port, debug, directory } = opts
      const idStore = loadFromIdStore ( defaultIdStoreDetails ( opts.id.toString (), defaultParserStore ) )
      startKoa ( directory.toString (), Number.parseInt ( port.toString () ), debug === true, wizardOfOzApiHandlers ( idStore, opts.debug === true ) )
    }
  })

}