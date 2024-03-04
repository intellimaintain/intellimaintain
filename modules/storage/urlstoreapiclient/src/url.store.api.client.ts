import { ErrorsAnd, mapErrorsK } from "@laoban/utils";
import { isUrlLoadResult, isUrlStoreResult, parseUrl, UrlLoadResult, UrlStoreResult } from "@intellimaintain/url";

export type UrlStoreApiClientConfig = {
  apiUrlPrefix: string // we place our url at the end of this
}

export async function loadFromApi ( config: UrlStoreApiClientConfig, urlAsString: string ): Promise<ErrorsAnd<UrlLoadResult>> {
  return mapErrorsK ( parseUrl ( urlAsString ), async _ => {//This is just error checking//validation
    try {
      const fullUrl = `${config.apiUrlPrefix}/${encodeURIComponent ( urlAsString )}`
      const response = await fetch ( fullUrl )
      if ( response.status < 400 ) {
        let result = await response.json ();
        if ( isUrlLoadResult ( result ) ) return result
        return [ `Failed to load ${urlAsString}. Expected a UrlLoadResult but got ${JSON.stringify ( result )}` ]
      } // this should be UrlLoadResult
      return [ `Failed to load ${urlAsString}. Status ${response.status}\n${await response.text ()}` ]
    } catch ( e ) {return [ `Failed to load ${urlAsString}`, e ] }
  } )
}

export async function saveToApi ( config: UrlStoreApiClientConfig, urlAsString: string, content: any ): Promise<ErrorsAnd<UrlStoreResult>> {
  return mapErrorsK ( parseUrl ( urlAsString ), async _ => {
      try {
        const fullUrl = `${config.apiUrlPrefix}/${encodeURIComponent ( urlAsString )}`
        const response = await fetch ( fullUrl, {
          method: 'PUT',
          body: JSON.stringify ( content ),
          headers: {
            'Content-Type': 'application/json '
          }
        } )
        if ( response.status < 400 ) {
          const result = await response.json ()
          if ( isUrlStoreResult ( result ) ) return result
          return [ `Failed to save ${urlAsString}. Expected a UrlStoreResult but got ${JSON.stringify ( result )}` ]
        }
        return [ `Failed to save ${urlAsString}. Status ${response.status}\n${await response.text ()}` ]
      } catch
        ( e ) {return [ `Failed to save ${urlAsString}`, e ] }
    }
  )
}
