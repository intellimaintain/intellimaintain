import { fileLoading, FileLoading, loadStringIncrementally, ResultAndNewStart } from "./file.loading";

export interface PollingDetails {
  debug?: boolean
  pollingInterval: number
  polling: boolean
  start: number

  pollingCallback: ( s: string ) => void
}


export function polling ( filePath: string,
                          pollingInterval: number,
                          pollingCallback: ( s: string ) => Promise<void>,
                          start: number = 0 ): PollingDetails {
  return { ...fileLoading ( filePath ), pollingInterval, polling: false, pollingCallback, start }
}
async function poll ( details: PollingDetails, getString: ( start: number ) => Promise<ResultAndNewStart>, ) {
  if ( details.debug ) console.log ( 'polling', details )
  if ( !details.polling ) return; // Exit if polling has been stopped
  const { newStart, result } = await getString ( details.start )
  if ( result.length > 0 ) await details.pollingCallback ( result );
  setTimeout ( () => poll ( { ...details, start: newStart }, getString ), details.pollingInterval );
}

async function pollFile ( pollDetails: PollingDetails, fileLoading: FileLoading ) {
  poll ( pollDetails, async start => loadStringIncrementally ( { ...fileLoading, lastFileSize: start } ) )
}

export function startPolling ( details: PollingDetails, getString: ( start: number ) => Promise<ResultAndNewStart> ) {
  if ( details.polling ) throw Error ( `Polling already active for ${JSON.stringify ( details )}` );
  details.polling = true;
  poll ( details, getString );
}
export function stopPolling ( details: PollingDetails ) {
  details.polling = false;
}

