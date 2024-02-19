import { fileLoading, FileLoading, loadStringIncrementally } from "./file.loading";

export interface PollingDetails extends FileLoading {
  pollingInterval: number
  polling: boolean
  pollingCallback: ( s: string ) => void
}

export function polling ( filePath: string, pollingInterval: number, pollingCallback: ( s: string ) => Promise<void> ): PollingDetails {
  return { ...fileLoading ( filePath ), pollingInterval, polling: false, pollingCallback }
}
async function pollFileChanges ( details: PollingDetails ) {
  if (details.debug)console.log('polling', details.filePath, details.polling, details.pollingInterval)
  if ( !details.polling ) return; // Exit if polling has been stopped
  const { fileLoading, result } = await loadStringIncrementally ( details )
  if ( result.length > 0 )  await details.pollingCallback ( result );
  setTimeout ( () => pollFileChanges ( { ...details, ...fileLoading } ), details.pollingInterval );
}
export function startPolling ( details: PollingDetails ) {
  if ( details.polling ) throw Error ( `Polling already active for ${JSON.stringify ( details )}` );
  details.polling = true;
  pollFileChanges ( details );
}
export function stopPolling ( details: PollingDetails ) {
  details.polling = false;
}

