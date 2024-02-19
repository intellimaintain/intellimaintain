import { cliTc, CliTc, CommandDetails, ContextConfigAndCommander, ExecuteFn, HasNameAndVersion, ListOfCommandDetails, SubCommandDetails } from "@intellimaintain/cli";
import { Command } from "commander";

const { program } = require ( 'commander' );

export type Commander12 = Command

export function createCommander12Fn<Context extends HasNameAndVersion, CleanConfig> ( context: Context, config: CleanConfig ): Commander12 {
  return program.name ( context.name )
    .version ( context.version )
    .usage ( '<command> [options]' );
}
export function addCommandDetails12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Commander12, Context, Config, CleanConfig>, cmd: CommandDetails<Commander12> ) {
  let command: Commander12 = cc.commander.command ( cmd.cmd ).description ( cmd.description );
  for ( let [ k, v ] of Object.entries ( cmd.options ) ) {
    command = command.option ( k, v.description, v.default );
  }
  command = command.action ( args => cmd.action ( command, { ...command.optsWithGlobals (), ...command.opts () }, args ) );
  return { ...cc, command }
}
export function addCommands12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Commander12, Context, Config, CleanConfig>, cmds: ListOfCommandDetails<Commander12, Context, CleanConfig> ):ContextConfigAndCommander<Commander12, Context, Config, CleanConfig> {
  for ( let c of cmds ) {
    if ( typeof c === 'function' ) {
      cc = addCommandDetails12 ( cc, c ( cc.context, cc.config ) )
    } else {
      cc = addCommandDetails12 ( cc, c )
    }
  }
  return cc
}


export function addSubCommand12<Context, Config, CleanConfig> ( cc: ContextConfigAndCommander<Commander12, Context, Config, CleanConfig>, cmd: SubCommandDetails<Commander12, Context, CleanConfig> ) {
  let commander: Commander12 = cc.commander.command ( cmd.cmd ).description ( cmd.description );
  return addCommands12 ( { ...cc, commander }, cmd.commands )
}

export async function execute12 ( commander: Commander12, args: string[] ): Promise<Commander12> {
  if ( args.length == 2 ) {
    commander.outputHelp ();
    return commander;
  }
  return commander.parse ( args );

}
export function commander12Tc<Context extends HasNameAndVersion, Config, CleanConfig> (): CliTc<Commander12, Context, Config, CleanConfig> {
  return cliTc<Commander12, Context, Config, CleanConfig> ( createCommander12Fn, addSubCommand12, addCommands12, execute12 )
}