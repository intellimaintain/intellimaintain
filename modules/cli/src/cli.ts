//Why make Commander a type parameter? Because of versions. We decouple ourself from the version


import { ErrorsAnd, mapErrors, NameAnd } from "@laoban/utils";
import { FileOps } from "@laoban/fileops";
import { CliConfigTC, loadConfig } from "./cliconfig";

export type ActionFn = ( ...args: any[] ) => void | Promise<void>
export interface Option {
  name: string
  description?: string
  default?: string
}
export interface CommandDetails {
  cmd: string
  description: string
  options: NameAnd<Option>
  action: ActionFn
}
export type CommandFn<Context, Config> = ( context: Context, config: Config ) => CommandDetails

export type ListOfCommandDetails<Context, Config> = (CommandDetails | CommandFn<Context, Config>)[]

export interface SubCommandDetails<Context, Config> {
  cmd: string
  description: string
  commands: ListOfCommandDetails<Context, Config>

}

//In practice will probably extend this.
export interface HasNameAndVersion {
  name: string
  version: string

}
export interface CliContext extends HasNameAndVersion {
  version: string,
  currentDirectory: string
  env: NameAnd<string>
  args: string[]
  fileOps: FileOps
}
export function cliContext ( name: string, version: string, fileOps: FileOps ): CliContext {
  return { name, version, currentDirectory: process.cwd (), env: process.env, fileOps, args: process.argv }
}

export type ContextConfigAndCommander<Context, CleanConfig, Commander> = {
  context: Context
  config: CleanConfig
  commander: Commander
}

export type CreateCommanderFn<Context, Commander, CleanConfig> = ( context: Context, config: CleanConfig ) => Commander
export type AddSubCommandFn<Context, Commander, CleanConfig> = ( cc: ContextConfigAndCommander<Context, CleanConfig, Commander>, cmd: SubCommandDetails<Context, CleanConfig> ) => ContextConfigAndCommander<Context, CleanConfig, Commander>
export type AddCommandsFn<Context, Commander, CleanConfig> = ( commander: ContextConfigAndCommander<Context, CleanConfig, Commander>, cmd: ListOfCommandDetails<Context, CleanConfig> ) => ContextConfigAndCommander<Context, CleanConfig, Commander>
export type ExecuteFn<Commander> = ( commander: Commander, args: string[] ) => Promise<Commander>

export type CliTc<Context, Commander, CleanConfig> = {
  createCommander: CreateCommanderFn<Context, Commander, CleanConfig>
  /** This is used to add a subcommand to a commander. The sub command will have commands coming off it*/
  addSubCommand: AddSubCommandFn<Context, Commander, CleanConfig>
  /** Adds an actual command that will do something */
  addCommands: AddCommandsFn<Context, Commander, CleanConfig>
  /** Adds an actual command that will do something. This is for when the command needs to be dynamically created based on context or config */
  execute: ExecuteFn<Commander>
}

export function cliTc<Context, Commander, CleanConfig> ( createCommander: CreateCommanderFn<Context, Commander, CleanConfig>,
                                                         addSubCommand: AddSubCommandFn<Context, Commander, CleanConfig>,
                                                         addCommands: AddCommandsFn<Context, Commander, CleanConfig>,
                                                         execute: ExecuteFn<Commander> ): CliTc<Context, Commander, CleanConfig> {

  return { createCommander, addSubCommand, addCommands, execute }
}

export async function makeCli<Context extends CliContext, Commander, Config, CleanConfig> ( context: Context,
                                                                                            configTc: CliConfigTC<Config, CleanConfig>,
                                                                                            cliTc: CliTc<Context, Commander, CleanConfig> ): Promise<ErrorsAnd<ContextConfigAndCommander<Context, CleanConfig, Commander>>> {
  return mapErrors ( await loadConfig ( context.fileOps, configTc, context.currentDirectory ),
    config => ({ context, config, commander: cliTc.createCommander ( context, config ) }) )
}