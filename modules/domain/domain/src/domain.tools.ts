import { ParserStoreParser } from "@intellimaintain/parser";
import { SoftwareCatalog } from "./domain";


export const scParser: ParserStoreParser = ( id, s ) => {
  const index1 = s.indexOf ( '\n' )
  if ( index1 < 0 ) return { error: 'No newline found' }
  const name = s.slice ( 0, index1 )
  const body = s.slice ( index1 + 1 )
  let softwareCatalog: SoftwareCatalog = { id, name, body }
  return softwareCatalog
}





