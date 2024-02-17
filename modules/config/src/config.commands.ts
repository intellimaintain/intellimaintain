import { CliConfigTC, CommandDetails, CommandFn, ContextConfigAndCommander, SubCommandDetails } from "@intellimaintain/cli";


export function viewConfigCommand<Context, Config, CleanConfig, Commander> ( tc: ContextConfigAndCommander<Context, Config, CleanConfig, Commander> ): CommandDetails {
  return {
    cmd: 'view',
    description: 'View the current configuration',
    options: {},
    action: async () => {
      console.log ( "Config location: ", tc.configFileName ? tc.configFileName : "undefined" );
      console.log ( JSON.stringify ( tc.cliConfigTc.cleanForDisplay ( tc.config ), null, 2 ) );
    }
  }
}
export function configCommands<Config, Commander, CleanConfig, Context> ( tc: ContextConfigAndCommander<Context, Config, CleanConfig, Commander> ): SubCommandDetails<Config, Context> {
  return {
    cmd: 'config',
    description: 'Config commands',
    commands: [ viewConfigCommand<Context, Config, CleanConfig, Commander> ( tc ) ]
  }
}
