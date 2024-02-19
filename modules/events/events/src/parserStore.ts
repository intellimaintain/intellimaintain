import { SetIdEvent } from "./events";
import { NameAnd } from "@laoban/utils";

export type ParserStoreResult = {
  event: SetIdEvent
  s: string
  result?: any
  error?: string
}
export type ParserStoreParser = ( s: string ) => any
export type  ParserStore = NameAnd<ParserStoreParser>


export type ParserUsingStoreFn = ( parserStore: ParserStore, s: string, event: SetIdEvent ) => ParserStoreResult
export const parseUsingStore: ParserUsingStoreFn = ( parserStore: ParserStore, s: string, event: SetIdEvent ): ParserStoreResult => {
  let parser = parserStore[ event.parser ];
  if ( !parser ) return { event, s, error: `No parser found for ${event.parser}` }
  try {
    return { event, s, result: parser ( s ) }
  } catch ( e ) {
    return { event, s, error: e.message }
  }
};

export const defaultParserStore: ParserStore = {
  json: JSON.parse
}


