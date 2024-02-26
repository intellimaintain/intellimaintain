//pretty nasty... mutates the state... but we do it before we start
import { ChatState } from "../domain/domain";
import { ListIds } from "@intellimaintain/listids";

export async function loadInitialIds ( listIds: ListIds,s: ChatState ) {
  const kaIds = await listIds ( 'ka' )
  console.log ( 'kaIds', kaIds )
  const scIds = await listIds ( 'sc' )
  console.log ( 'scIds', scIds )
  const ticketIds = await listIds ( 'ticket' )
  console.log ( 'ticketIds', ticketIds )
  const templateIds = await listIds ( 'template' )
  console.log ( 'template', templateIds )

  s.kas.options = kaIds.map ( k => ({ id: k, name: k }) )
  s.scs.options = scIds.map ( k => ({ id: k, name: k }) )
  s.tickets.options = ticketIds.map ( k => ({ id: k, name: k }) )
  s.templates.options = templateIds.map ( k => ({ id: k, name: k }) )

  console.log ( 's', s )
}
