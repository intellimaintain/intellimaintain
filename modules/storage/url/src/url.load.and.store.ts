import { ErrorsAnd } from "@laoban/utils";

export type UrlLoadResult = {
  url: string
  mimeType: string
  result: any  //the result should be in line with the mimeType
  fileSize: number //If you ask again for 'appends' this is the start point
  id: string //The id is something like itsmid:org:namespace:id. Note that if this is a identity url then the id should be the same as the url
}

export type UrlLoadFn = ( url: string ) => Promise<ErrorsAnd<UrlLoadResult>>

export type UrlStoreResult = {
  url: string
  fileSize: number
  id: string
}

export type UrlSaveFn = ( url: string,  content: any ) => Promise<ErrorsAnd<UrlStoreResult>>