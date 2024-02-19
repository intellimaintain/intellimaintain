export interface ResultAndNewStart {
  result: string
  newStart: number
}
export interface PollingDetails {
  debug?: boolean
  pollingInterval: number
  polling: boolean
  start: number
  pollingCallback: ( s: string ) => void
}


export function polling (
  pollingInterval: number,
  pollingCallback: ( s: string ) => Promise<void>,
  start: number = 0 ): PollingDetails {
  return { pollingInterval, polling: false, pollingCallback, start }
}
async function poll ( details: PollingDetails, getString: ( start: number ) => Promise<ResultAndNewStart>, ) {
  if ( details.debug ) console.log ( 'polling', details )
  if ( !details.polling ) return; // Exit if polling has been stopped
  try {
    const { newStart, result } = await getString ( details.start )
    if ( result.length > 0 ) await details.pollingCallback ( result );
    setTimeout ( () => poll ( { ...details, start: newStart }, getString ), details.pollingInterval );
  } catch ( e ) {
    console.error ( e )
    setTimeout ( () => poll ( details, getString ), details.pollingInterval );
  }
}

export function startPolling ( details: PollingDetails, getString: ( start: number ) => Promise<ResultAndNewStart> ) {
  if ( details.polling ) throw Error ( `Polling already active for ${JSON.stringify ( details )}` );
  details.polling = true;
  poll ( details, getString );
}
export function stopPolling ( details: PollingDetails ) {
  details.polling = false;
}

