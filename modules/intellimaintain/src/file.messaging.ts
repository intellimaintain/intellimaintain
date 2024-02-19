import { SubCommandDetails } from "@intellimaintain/cli";


export function fileMessagingCommands<Commander,Context, Config> (): SubCommandDetails<Commander,Context, Config> {
  return {
    cmd: 'messaging',
    description: 'File messaging commands',
    commands: [
      {
        cmd: 'listen <file>', description: 'Listen for messages',
        options: { "-p,--poll": { name: "---poll <poll>", description: "Polling interval", default: "1000" } },
        action: ( commander, opts, args ) => {
          console.log ( `listen - opts`, opts )
          console.log ( `listen - args`, args )
        }
      },
    ]
  }

}