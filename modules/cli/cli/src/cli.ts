//Why make Commander a type parameter? Because of versions. We decouple ourselves from the version


import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { FileOps } from "@laoban/fileops";
import { CliConfigTC, CliTcFinder, loadConfig } from "./cliconfig";

export type ActionFn<Commander> = ( commander: Commander, opts: NameAnd<string | boolean>, ...args: any[] ) => void | Promise<void>
export interface Option {
  description?: string
  default?: string
}
export interface CommandDetails<Commander> {
  cmd: string
  description: string
  options: NameAnd<Option>
  action: ActionFn<Commander>
}
export type CommandFn<Commander, Context, Config> = ( context: Context, config: Config ) => CommandDetails<Commander>

export type ListOfCommandDetails<Commander, Context, Config> = (CommandDetails<Commander> | CommandFn<Commander, Context, Config>)[]

export interface SubCommandDetails<Commander, Context, Config> {
  cmd: string
  description: string
  commands: ListOfCommandDetails<Commander, Context, Config>

}

//In practice will probably extend this.
export interface HasNameAndVersion {
  name: string
  version: string

}
export interface HasCurrentDirectory {
  currentDirectory: string

}
export interface CliContext extends HasNameAndVersion, HasCurrentDirectory {
  env: NameAnd<string>
  args: string[]
  fileOps: FileOps
}
export function cliContext ( name: string, version: string, fileOps: FileOps ): CliContext {
  return { name, version, currentDirectory: process.cwd (), env: process.env, fileOps, args: process.argv }
}

export type ContextConfigAndCommander<Commander, Context, Config, CleanConfig> = {
  context: Context
  config: CleanConfig
  configFileName?: string
  cliConfigTc: CliConfigTC<Config, CleanConfig>
  commander: Commander
}

export type CreateCommanderFn<Commander, Context, CleanConfig> = ( context: Context, config: CleanConfig ) => Commander
export type AddSubCommandFn<Commander, Context, Config, CleanConfig> = ( cc: ContextConfigAndCommander<Commander, Context, Config, CleanConfig>, cmd: SubCommandDetails<Commander, Context, CleanConfig> ) => ContextConfigAndCommander<Commander, Context, Config, CleanConfig>
export type AddCommandsFn<Commander, Context, Config, CleanConfig> = ( commander: ContextConfigAndCommander<Commander, Context, Config, CleanConfig>, cmd: ListOfCommandDetails<Commander, Context, CleanConfig> ) => ContextConfigAndCommander<Commander, Context, Config, CleanConfig>
export type ExecuteFn<Commander> = ( commander: Commander, args: string[] ) => Promise<Commander>

export type CliTc<Commander, Context, Config, CleanConfig> = {
  createCommander: CreateCommanderFn<Commander, Context, CleanConfig>
  /** This is used to add a subcommand to a commander. The sub command will have commands coming off it*/
  addSubCommand: AddSubCommandFn<Commander, Context, Config, CleanConfig>
  /** Adds an actual command that will do something */
  addCommands: AddCommandsFn<Commander, Context, Config, CleanConfig>
  /** Adds an actual command that will do something. This is for when the command needs to be dynamically created based on context or config */
  execute: ExecuteFn<Commander>
}

export function cliTc<Commander, Context, Config, CleanConfig> ( createCommander: CreateCommanderFn<Commander, Context, CleanConfig>,
                                                                 addSubCommand: AddSubCommandFn<Commander, Context, Config, CleanConfig>,
                                                                 addCommands: AddCommandsFn<Commander, Context, Config, CleanConfig>,
                                                                 execute: ExecuteFn<Commander> ): CliTc<Commander, Context, Config, CleanConfig> {

  return { createCommander, addSubCommand, addCommands, execute }
}

export async function makeCli<Commander, Context extends CliContext, Config, CleanConfig> ( context: Context,
                                                                                            configTc: CliTcFinder<Config, CleanConfig>,
                                                                                            cliTc: CliTc<Commander, Context, Config, CleanConfig> ): Promise<ErrorsAnd<ContextConfigAndCommander<Commander, Context, Config, CleanConfig>>> {
  return mapErrors ( await loadConfig ( context.fileOps, configTc, context.currentDirectory ),
    ( { config, cliConfigTc, configFileName } ) =>
      ({ context, config, cliConfigTc, commander: cliTc.createCommander ( context, config ), configFileName }) )
}