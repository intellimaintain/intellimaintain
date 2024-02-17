import { CliConfigTC, CommandDetails, CommandFn, SubCommandDetails } from "@intellimaintain/cli";


export function viewConfigCommand<Config, CleanConfig> ( tc: CliConfigTC<Config, CleanConfig>, config: CleanConfig ): CommandDetails {
  return {
    cmd: 'view',
    description: 'View the current configuration',
    options: {},
    action: async () =>
      console.log ( JSON.stringify ( tc.cleanForDisplay ( config ), null, 2 ) )
  }
}
export function configCommands<Config, CleanConfig, Context> ( tc: CliConfigTC<Config, CleanConfig>, config: CleanConfig ): SubCommandDetails<Config, Context> {
  return {
    cmd: 'config',
    description: 'Config commands',
    commands: [ viewConfigCommand<Config, CleanConfig> ( tc, config ) ]
  }
}
