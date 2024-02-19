import { SubCommandDetails } from "@intellimaintain/cli";


export function fileMessagingCommands<Context, Config> (): SubCommandDetails<Context, Config> {
  return {
    cmd: 'messaging',
    description: 'File messaging commands',
    commands: [
      {
        cmd: 'listen [file]', description: 'Listen for messages',
        options: { "-p,--poll": { name: "---poll <poll>", description: "Polling interval", default: "1000" } },
        action: () => {
          console.log ( `listen` )
        }
      },
    ]
  }

}