import { ErrorsAnd } from "@laoban/utils";

export type UrlStoreResult = {
  url: string
  mimeType: string
  result: any  //the result should be in line with the mimeType
  count: number //If you ask again for 'appends' this is the start point
  id: string //The id is something like itsmid:org:namespace:id. Note that if this is a identity url then the id should be the same as the url
}

export type UrlLoadFn = ( url: string ) => Promise<ErrorsAnd<UrlStoreResult>>