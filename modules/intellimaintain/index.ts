#!/usr/bin/env node

import { Commander12, commander12Tc } from "@intellimaintain/commander12";
import { cliContext, CliContext, CliTc, CliTcFinder, defaultTo, fileConfig, makeCli } from "@intellimaintain/cli";
import { fileOpsNode } from "@laoban/filesops-node";
import { CleanConfig, Config, configCommands } from "@intellimaintain/config";
import { hasErrors, reportErrors } from "@laoban/utils";
import { fileMessagingCommands } from "./src/file.messaging";

export function findVersion () {
  let packageJsonFileName = "../package.json";
  try {
    return require ( packageJsonFileName ).version
  } catch ( e ) {
    return "version not known"
  }
}

const context: CliContext = cliContext ( 'intellimaintain', findVersion (), fileOpsNode () )
const cliTc: CliTc<CliContext, Commander12, Config, CleanConfig> = commander12Tc<CliContext, Config, CleanConfig> ()
const configFinder: CliTcFinder<Config, CleanConfig> = fileConfig<CliContext, Config, CleanConfig> ( '.intellimaintain',
  ( c: any ) => c,
  defaultTo ( {}, 'NotFound' ) )

makeCli<CliContext, Commander12, Config, CleanConfig> ( context, configFinder, cliTc ).then ( async ( commander ) => {
  if ( hasErrors ( commander ) ) {
    reportErrors ( commander )
    process.exit ( 1 )
  }
  cliTc.addSubCommand ( commander, configCommands ( commander ) )
  cliTc.addSubCommand ( commander, fileMessagingCommands<CliContext, CleanConfig> () )
  cliTc.addSubCommand ( commander, fileMessagingCommands<CliContext, CleanConfig> () )
  return await cliTc.execute ( commander.commander, context.args )
} )


