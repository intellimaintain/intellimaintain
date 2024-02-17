import { ErrorsAnd, mapErrors, mapErrorsK } from "@laoban/utils";
import { FileOps, findFileUp, parseJson } from "@laoban/fileops";
import { CliContext } from "./cli";

//To support chain of responsibility
export type FileNameAndCliConfigTc<Config, Clean> = {
  fileName?: string
  tc: CliConfigTC<Config, Clean>
}
export type ValidateFn<Config, CleanConfig> = ( config: Config ) => ErrorsAnd<CleanConfig>
export interface CliConfigTC<Config, Clean> {
  load: ( fileOps: FileOps ) => ( file: string | undefined ) => Promise<ErrorsAnd<Config>>
  displayErrors: ( errors: string[] ) => void // may do a process.exit
  validate: ValidateFn<Config, Clean>
  cleanForDisplay ( config: Clean ): any // in case we need to remove sensitive information
}

export type CliTcFinder<Config, Clean> = ( fileOps: FileOps, startDir: string ) =>
  Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, Clean>>> //might be file or directory. Doesn't matter. Is handed to load

export interface ConfigAndCliTc<Config, Clean> {
  cliConfigTc: CliConfigTC<Config, Clean>
  configFileName?: string
  config: Clean
}

export async function loadConfig<Config, Clean> ( fileOps: FileOps, tcFinder: CliTcFinder<Config, Clean>, startDir: string ): Promise<ErrorsAnd<ConfigAndCliTc<Config, Clean>>> {
  let found = await await tcFinder ( fileOps, startDir );
  return mapErrorsK ( found,
    async ( { tc: cliConfigTc, fileName: configFileName } ) => mapErrors ( mapErrors (
      await cliConfigTc.load ( fileOps ) ( configFileName ), cliConfigTc.validate ), ( config: Clean ) =>
      ({ cliConfigTc, config, configFileName }) ) )
}

function fixedCliTc<Config> ( config: Config ) {
  return {
    load: () => async () => config,
    displayErrors: () => {},
    validate: c => c,
    cleanForDisplay: c => c
  };
}
//clean up... separate maybe? Or just put up with the mess in find... Doesn't feel right to have it and the others in the same level in the  interface though
export function fixedConfig<Config> ( config: Config ): CliTcFinder<Config, Config> {
  const tc = fixedCliTc ( config );
  return () => Promise.resolve ( { tc } );
}

export function notFoundError<Config, CleanConfig> ( name: string ): Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, CleanConfig>>> {
  return Promise.resolve ( [ `File ${name} not found in current directory or any parent directory` ] )
}
export const defaultTo = <Config> ( config: Config, fileName?: string ) => async <CleanConfig> ( name: string ): Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, CleanConfig>>> =>
  ({ tc: fixedCliTc<Config> ( config ) , fileName})
export function fileConfig<Context extends CliContext, Config, CleanConfig> ( name: string, validate: ValidateFn<Config, CleanConfig>,
                                                                              onNotFound: ( name: string ) => Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, CleanConfig>>> ): CliTcFinder<Config, CleanConfig> {
  return async ( fileOps: FileOps, currentDirectory: string ): Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, CleanConfig>>> => {
    const fileName = await findFileUp ( currentDirectory, dir => fileOps.isFile ( fileOps.join ( dir, name ) ) )
    if ( fileName === undefined ) return onNotFound ( name )
    const tc: CliConfigTC<Config, CleanConfig> = {
      load: ( fileOps: FileOps ) => async ( dir: string ) => {
        let fileOrUrl = fileOps.join ( dir, name );
        return fileOps.loadFileOrUrl ( fileOrUrl ).then ( parseJson ( `Loading file ${fileOrUrl} for Config` ) );
      },
      displayErrors: ( errors: string[] ) => reportError ( errors ),
      validate,
      cleanForDisplay: c => c
    };
    return { tc, fileName }
  }
}