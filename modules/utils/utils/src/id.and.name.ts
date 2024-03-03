export type IdAndName = {
  id: string
  name: string
}
export interface SelectedAndList<T extends IdAndName> {
  options: IdAndName[]
  selected?: string
  item?: T
}
export type KeyAndPath = {
  key: string
  path: string
}
export function findIdKeyAndPath ( s: string ): KeyAndPath {
  const index = s.indexOf ( ':' )
  if ( index === -1 ) throw Error ( `Invalid id no ':' in ${s}]` )
  const key = s.slice ( 0, index )
  const path = s.slice ( index + 1 ).replace ( /:/g, '/' )
  return { key, path };
}