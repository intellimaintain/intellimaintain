import { cliTc, CliTc, CommandDetails, ContextConfigAndCommander, ExecuteFn, HasNameAndVersion, ListOfCommandDetails, SubCommandDetails } from "@intellimaintain/cli";
import { Command } from "commander";

const { program } = require ( 'commander' );

export function createCommander12Fn<Context extends HasNameAndVersion, CleanConfig> ( context: Context, config: CleanConfig ): Command {
  return program.name ( context.name )
    .version ( context.version )
    .usage ( '<command> [options]' );
}
export function addCommandDetails12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Context, Config, CleanConfig, Command>, cmd: CommandDetails ) {
  let command = cc.commander.command ( cmd.cmd ).description ( cmd.description );
  for ( let [ k, v ] of Object.entries ( cmd.options ) ) {
    command = command.option ( k, v.description, v.default );
  }
  command = command.action ( cmd.action );
  return { ...cc, command }
}
export function addCommands12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Context, Config, CleanConfig, Command>, cmds: ListOfCommandDetails<Context, CleanConfig> ) {
  for ( let c of cmds ) {
    if ( typeof c === 'function' ) {
      cc = addCommandDetails12 ( cc, c ( cc.context, cc.config ) )
    } else {
      cc = addCommandDetails12 ( cc, c )
    }
  }
  return cc
}


export function addSubCommand12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Context, Config, CleanConfig, Command>, cmd: SubCommandDetails<Context, CleanConfig> ) {
  let commander = cc.commander.command ( cmd.cmd ).description ( cmd.description );
  return addCommands12 ( { ...cc, commander }, cmd.commands )
}

export async function execute12 ( commander: Command, args: string[] ): Promise<Command> {
  if ( args.length == 2 ) {
    commander.outputHelp ();
    return commander;
  }
  return commander.parse ( args );

}
export function commander12Tc<Context extends HasNameAndVersion, Config, CleanConfig> (): CliTc<Context, Command, Config, CleanConfig> {
  return cliTc ( createCommander12Fn, addSubCommand12, addCommands12, execute12 )
}