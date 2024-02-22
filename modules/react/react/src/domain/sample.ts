import { blankChatState, DemoChatState } from "./domain";
import { IdAndName } from "@intellimaintain/domain";
import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { Tickets } from "@intellimaintain/react_ticket";
import { SoftwareCatalogs } from "@intellimaintain/react_softwarecatalog"

export const ticket1: IdAndName = { id: 'ticket:pa123', name: 'Ticket PA123' };
export const ticket2: IdAndName = { id: 'ticket:pa124', name: 'Ticket PA124' };
let tickets: Tickets = {
  selected: undefined,
  item: undefined,
  options: [ ticket1, ticket2 ]
}

export const ka1: IdAndName = {
  id: 'ka:deleteProject',
  name: 'Delete Project'
};
export const kas: KnowledgeArticles = {
  selected: undefined,
  item: undefined,
  options: [ ka1 ]
}


export const scEPX: IdAndName = {
  id: "sc:EPX",
  name: "EPX"
}
export const scs: SoftwareCatalogs = {
  selected: undefined,
  item: undefined,
  options: [ scEPX ]
}

let chatState = blankChatState ( 'Operator', 'Wizard', kas, scs, tickets );
export const startAppState: DemoChatState = {
  chatState1: chatState,
  chatState2: chatState
}