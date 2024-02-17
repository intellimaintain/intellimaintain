import { ErrorsAnd, mapErrors, mapErrorsK } from "@laoban/utils";
import { FileOps } from "@laoban/fileops";

//To support chain of responsibility
export type FileNameAndCliConfigTc<Config, Clean> = {
  fileName: string
  tc: CliConfigTC<Config, Clean>
}
export interface CliConfigTC<Config, Clean> {
  load: ( fileOps: FileOps ) => ( file: string ) => Promise<ErrorsAnd<Config>>
  displayErrors: ( errors: string[] ) => void // may do a process.exit
  validate ( config: Config ): ErrorsAnd<Clean>
  cleanForDisplay ( config: Clean ): any // in case we need to remove sensitive information
}

export type CliTcFinder<Config, Clean> = ( fileOps: FileOps, startDir: string ) => Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, Clean>>> //might be file or directory. Doesn't matter. Is handed to load

export interface ConfigAndCliTc<Config, Clean> {
  cliConfigTc: CliConfigTC<Config, Clean>
  config: Clean

}

export async function loadConfig<Config, Clean> ( fileOps: FileOps, tcFinder: CliTcFinder<Config, Clean>, startDir: string ): Promise<ErrorsAnd<ConfigAndCliTc<Config, Clean>>> {
  let found = await await tcFinder ( fileOps, startDir );
  return mapErrorsK ( found,
    async ( { tc: cliConfigTc, fileName } ) => mapErrors ( mapErrors (
      await cliConfigTc.load ( fileOps ) ( fileName ), cliConfigTc.validate ), config =>
      ({ cliConfigTc, config }) ) )
}

//clean up... separate maybe? Or just put up with the mess in find... Doesn't feel right to have it and the others in the same level in the  interface though
export function fixedConfig<Config> ( config: Config ): CliTcFinder<Config, Config> {
  const tc = {
    load: () => async () => config,
    displayErrors: () => {},
    validate: c => c,
    cleanForDisplay: c => c
  };
  return () => Promise.resolve ( { tc, fileName: 'ignore' } );
}