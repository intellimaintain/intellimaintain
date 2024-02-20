import { NameAnd } from "@laoban/utils";

export type ParserStoreResult = {
  parser: string
  s: string
  result?: any
  error?: string
}
export type ParserStoreParser = ( id: string, s: string ) => any
export type  ParserStore = NameAnd<ParserStoreParser>


export type ParserUsingStoreFn = ( parserStore: ParserStore, id: string, s: string, parser: string ) => ParserStoreResult
export const parseUsingStore: ParserUsingStoreFn = ( parserStore: ParserStore, id: string, s: string, parser: string ): ParserStoreResult => {
  let theParser = parserStore[ parser ];
  if ( !theParser ) return { parser, s, error: `No parser found for ${parser}` }
  try {
    return { parser, s, result: theParser ( id, s ) }
  } catch ( e ) {
    return { parser, s, error: e.message }
  }
};


