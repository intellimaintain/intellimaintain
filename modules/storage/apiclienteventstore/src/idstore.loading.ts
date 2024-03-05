import { IdStore } from "@intellimaintain/idstore";
import { ParserStore, parseUsingStore } from "@intellimaintain/parser";

export interface ApiIdStore {
  url: string;
  parserStore: ParserStore

}
export function apiIdStore ( url: string, parserStore: ParserStore ): ApiIdStore {
  return { url, parserStore }

}
export function idStoreFromApi ( apiIdStore: ApiIdStore ): IdStore {
  return async ( id, parser ) => {
    let response = await fetch ( apiIdStore.url + "/id/" + id );
    const result = await response.text ();
    if ( response.status < 400 ) {
      const parseResult = parseUsingStore ( apiIdStore.parserStore, id, result, parser )
      if ( parseResult.error ) return { id, error: parseResult.error }
      return { id, result: parseResult.result, mimeType: response.headers.get ( 'content-type' ) || 'text/plain; charset=UTF-8' };
    } else {
      return { id, error: `Error loading ${apiIdStore.url} ${response.status}\n${result}` };
    }
  }
}