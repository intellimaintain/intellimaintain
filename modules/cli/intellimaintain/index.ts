#!/usr/bin/env node

import { Commander12, commander12Tc } from "@intellimaintain/commander12";
import { cliContext, CliContext, CliTc, CliTcFinder, defaultTo, fileConfig, makeCli } from "@intellimaintain/cli";
import { fileOpsNode } from "@laoban/filesops-node";
import { CleanConfig, Config, configCommands } from "@intellimaintain/config";
import { hasErrors, reportErrors } from "@laoban/utils";
import { eventStoreCommands } from "./src/event.store.cli";

import { apiCommand } from "@intellimaintain/api";
import { idStoreCommands } from "./src/id.store.cli";
import { addVariableCommands } from "./src/variables.cli";
import { YamlCapability } from "@intellimaintain/yaml";
import { jsYaml } from "@intellimaintain/jsyaml";


export function findVersion () {
  let packageJsonFileName = "../package.json";
  try {
    return require ( packageJsonFileName ).version
  } catch ( e ) {
    return "version not known"
  }
}

const context: CliContext = cliContext ( 'intellimaintain', findVersion (), fileOpsNode () )
const cliTc: CliTc<Commander12, CliContext, Config, CleanConfig> = commander12Tc<CliContext, Config, CleanConfig> ()
const configFinder: CliTcFinder<Config, CleanConfig> = fileConfig<CliContext, Config, CleanConfig> ( '.intellimaintain',
  ( c: any ) => c,
  defaultTo ( {}, 'NotFound' ) )

const yaml: YamlCapability = jsYaml ()
makeCli<Commander12, CliContext, Config, CleanConfig> ( context, configFinder, cliTc ).then ( async ( commander ) => {
  if ( hasErrors ( commander ) ) {
    reportErrors ( commander )
    process.exit ( 1 )
  }
  cliTc.addSubCommand ( commander, configCommands ( commander ) )
  cliTc.addSubCommand ( commander, eventStoreCommands<Commander12, CliContext, CleanConfig> ( yaml ) )
  cliTc.addSubCommand ( commander, idStoreCommands<Commander12, CliContext, CleanConfig> ( yaml ) )
  cliTc.addSubCommand ( commander, addVariableCommands<Commander12, CliContext, CleanConfig> ( yaml ) )
  cliTc.addCommands ( commander, [ apiCommand ( yaml ) ] )
  return await cliTc.execute ( commander.commander, context.args )
} )


