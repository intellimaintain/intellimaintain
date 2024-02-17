import { ErrorsAnd, hasErrors, mapErrors, mapErrorsK } from "@laoban/utils";
import { FileOps } from "@laoban/fileops";

//To support chain of responsibility
export type FileNameAndCliConfigTc<Config, Clean> = {
  fileName: string
  tc: CliConfigTC<Config, Clean>
}
export interface CliConfigTC<Config, Clean> {
  find: ( fileOps: FileOps, startDir: string ) => Promise<ErrorsAnd<FileNameAndCliConfigTc<Config, Clean>>> //might be file or directory. Doesn't matter. Is handed to load
  load: ( fileOps: FileOps ) => ( file: string ) => Promise<ErrorsAnd<Config>>
  displayErrors: ( errors: string[] ) => void // may do a process.exit
  validate ( config: Config ): ErrorsAnd<Clean>
  cleanForDisplay ( config: Clean ): any // in case we need to remove sensitive information
}

export async function loadConfig<Config, Clean> ( fileOps: FileOps, tc: CliConfigTC<Config, Clean>, startDir: string ): Promise<ErrorsAnd<Clean>> {
  let found = await await tc.find ( fileOps, startDir );
  return mapErrorsK ( found,
    async ( { tc: actualTc, fileName } ) =>
      mapErrors ( await actualTc.load ( fileOps ) ( fileName ), actualTc.validate ) )
}

//clean up... separate maybe? Or just put up with the mess in find... Doesn't feel right to have it and the others in the same level in the  interface though
export function fixedConfig<Config> ( config: Config ): CliConfigTC<Config, Config> {
  const tc = {
    find: async () => ({ tc, fileName: 'ignore' }),
    load: () => async () => config,
    displayErrors: () => {},
    validate: c => c,
    cleanForDisplay: c => c
  };
  return tc
}