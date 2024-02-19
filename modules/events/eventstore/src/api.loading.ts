export interface ApiLoading {
  url: string;
  start: number
}

export async function apiLoadingFromBrowser ( loading: ApiLoading ) {
  const response = await fetch ( loading.url + "?start=" + loading.start )
  if ( response.status < 400 ) {
    const text = await response.text ()
    const index = text.indexOf ( '\n' )
    const firstLine = text.slice ( 0, index )
    const nextStart = parseInt ( firstLine )
    const rest = text.slice ( index + 1 )
    return { nextStart, rest }
  }
}