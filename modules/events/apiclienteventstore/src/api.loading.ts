import { ResultAndNewStart } from "@intellimaintain/eventstore";

export interface ApiLoading {
  url: string;
}
export function apiLoading ( url: string ): ApiLoading {
  return { url }
}

export const apiLoadingFromBrowser = ( loading: ApiLoading ) => async ( start: number ): Promise<ResultAndNewStart> => {
  const response = await fetch ( loading.url + "?start=" + start )
  if ( response.status < 400 ) {
    const text = await response.text ()
    const index = text.indexOf ( '\n' )
    const firstLine = text.slice ( 0, index )
    const newStart = parseInt ( firstLine )
    const result = text.slice ( index + 1 )
    return { newStart, result }
  }
  throw new Error ( `Error loading ${loading.url} ${response.status}` )
};