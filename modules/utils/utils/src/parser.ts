export interface Parser<T> {
  parse: ( context: string ) => ( s: string ) => T
}