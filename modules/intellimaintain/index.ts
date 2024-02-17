#!/usr/bin/env node

import { commander12Tc } from "@intellimaintain/commander12";
import { cliContext, CliContext, CliTcFinder, fixedConfig, makeCli } from "@intellimaintain/cli";
import { fileOpsNode } from "@laoban/filesops-node";
import { Command } from "commander";
import { CleanConfig, Config, configCommands } from "@intellimaintain/config";
import { hasErrors, reportErrors } from "@laoban/utils";

export function findVersion () {
  let packageJsonFileName = "../package.json";
  try {
    return require ( packageJsonFileName ).version
  } catch ( e ) {
    return "version not known"
  }
}

const context: CliContext = cliContext ( 'intellimaintain', findVersion (), fileOpsNode () )
const cliTc = commander12Tc<CliContext, Config, CleanConfig> ()
const configFinder: CliTcFinder<Config, CleanConfig> = fixedConfig ( {} )

makeCli<CliContext, Command, Config, CleanConfig> ( context, configFinder, cliTc ).then ( async ( commander ) => {
  if ( hasErrors ( commander ) ) {
    reportErrors ( commander )
    process.exit ( 1 )
  }
  cliTc.addSubCommand ( commander, configCommands ( commander.cliConfigTc, commander.config ) )
  return await cliTc.execute ( commander.commander, context.args )
} )


