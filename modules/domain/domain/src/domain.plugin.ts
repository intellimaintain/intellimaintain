import { ExtractVariablesFn, VariablesExtractor } from "@intellimaintain/variables";
import { ParserStoreParser } from "@intellimaintain/parser";
import { IdStoreDetails } from "@intellimaintain/idstore";

/** How to get a domain artifact from an id store, parsing it, and so on. All the stuff you nee apart from react
 *
 * It's not react because we don't want to bind the react libraries to the domain code (we use it from cli or example
 * */
export interface DomainPlugin<T> {
  prefix: string
  parser: ParserStoreParser
  variablesExtractor: ExtractVariablesFn<T>
  idStoreDetails: IdStoreDetails
}