import { SubCommandDetails } from "@intellimaintain/cli";
import { eventStore, polling, setEventStoreValue, startPolling, stringToEvents } from "@intellimaintain/eventstore";
import { defaultEventProcessor, NoIdStore, processEvents } from "@intellimaintain/events";
import { fileLoading, loadStringIncrementally } from "@intellimaintain/fileeventstore";

export function eventStoreCommands<Commander, Context, Config> (): SubCommandDetails<Commander, Context, Config> {

  return {
    cmd: 'polling',
    description: 'File messaging commands',
    commands: [ {
      cmd: 'file <file>', description: 'Polls for changes in the files. For testing the polling s/w',
      options: { '-p,--poll <poll>': { description: "Polling interval", default: "1000" } },
      action: async ( commander, opts, file ) => {
        console.log ( `Listening to ${file} ${JSON.stringify ( opts )}` )
        const pollingDetails = polling ( parseInt ( opts.poll.toString () ), async x => console.log ( x ), 0 )
        startPolling ( pollingDetails, loadStringIncrementally ( fileLoading ( file ) ) )
      }
    },
      {
        cmd: 'events <file>', description: 'Polls for changes in the files. parses into events',
        options: { "-p,--poll": { description: "Polling interval", default: "1000" } },
        action: async ( commander, opts, file ) => {
          console.log ( `Listening to ${file} ${JSON.stringify ( opts )}` )
          const pollingDetails = polling ( parseInt ( opts.poll.toString () ), async s => {
            const events = await stringToEvents ( { file }, s )
            events.forEach ( e => console.log ( e ) )
          } )
          startPolling ( pollingDetails, loadStringIncrementally ( fileLoading ( file ) ) )
        }
      }, {
        cmd: 'store <file>', description: 'Polls for changes in the files. processes events against a store',
        options: {
          "-p,--poll": { description: "Polling interval", default: "1000" },
          "-d,--debug": { description: "Adds debugging information" }
        },
        action: async ( commander, opts, file ) => {
          console.log ( `Listening to ${file} ${JSON.stringify ( opts )}` )
          const store = eventStore<any> ( opts.debug === true )
          // addEventStoreListener( store, ( s, setJson ) => console.log ( s )  )
          const sep = defaultEventProcessor ( 'start.', {}, NoIdStore )
          const fl = fileLoading ( file )
          const pollingDetails = polling ( parseInt ( opts.poll.toString () ), async s => {
            const events = await stringToEvents ( { file }, s )
            if ( store.debug ) console.log ( 'events', JSON.stringify ( events ) )
            const { state, errors } = await processEvents ( sep, store.state, events )
            errors.forEach ( e => console.log ( e ) )
            setEventStoreValue ( store ) ( state )
            console.log ( JSON.stringify ( store.state ) )
          } )
          startPolling ( pollingDetails, loadStringIncrementally ( fl ) )
        }
      } ]
  }

}