import { extractVariablesFrom, Variables, VariablesExtractor } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { ChatState } from "../domain/domain";
import { IdAndName, JSONObject, SelectedAndList } from "@intellimaintain/utils";

export function extractVariablesFromSelectedAndList<T extends IdAndName> ( ve: VariablesExtractor, context: string, soFar: JSONObject, se: SelectedAndList<T> ): Variables {
  function error ( msg: string ) {return { variables: {}, errors: [ msg ] } }
  if ( se.selected === undefined ) return error ( `No ${context} selected` )
  if ( se.item === undefined ) return error ( `No ${context} loaded (id is ${se.selected})` )
  console.log ( 'extractVariablesFromSelectedAndList', 'selected', se.selected, 'item', se.item )
  return extractVariablesFrom ( ve, se.selected, soFar, se.item )
}

export function extractVariablesAndAddToState ( ve: VariablesExtractor, chat: ChatState ): ChatState {
  const operator: Variables = { variables: { 'operator': { email: chat.who, name: 'phil' } }, errors: [] }
  let ticket: Variables = extractVariablesFromSelectedAndList ( ve, 'Ticket', operator.variables, chat.tickets );
  const soFar: JSONObject = { ...operator.variables, ...ticket.variables }
  let ka = extractVariablesFromSelectedAndList ( ve, 'Knowledge Article', soFar, chat.kas );
  const soFarWithVariables: JSONObject = { ...soFar, ...ka.variables }
  let sc = extractVariablesFromSelectedAndList ( ve, 'Software Catalog', soFarWithVariables, chat.scs );
  const summary: JSONObject = { ...soFarWithVariables, ...sc.variables }
  const allErrors = [ operator.errors, ticket.errors, ka.errors, sc.errors ].flat ()
  const variables: NameAnd<Variables> = {
    Operator: operator,
    Ticket: ticket,
    'Knowledge Article': ka,
    'Software Catalog': sc,
    'Summary': { variables: summary, errors: allErrors }
  }
  return { ...chat, variables }
}
