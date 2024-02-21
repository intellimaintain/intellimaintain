import { Tickets } from "./ticket/ticket";
import { blankChatState, DemoChatState } from "./domain";
import { KnowledgeArticles } from "./ka/ka";
import { SoftwareCatalogs } from "./softwarecatalog/sc";
import { IdAndName } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";

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

export const startAppState: DemoChatState = {
  chatState1: blankChatState ( 'Operator', 'Wizard', kas, scs, tickets ),
  chatState2: blankChatState ( 'Wizard', 'Operator', kas, scs, tickets )
}