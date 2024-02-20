import { Tickets } from "./ticket/ticket";
import { blankChatState, DemoChatState } from "./domain";
import { KnowledgeArticles } from "./ka/ka";
import { DisplaySoftwareCatalog, SoftwareCatalogs } from "./softwarecatalog/sc";
import { IdAndName, KnowledgeArticle, SoftwareCatalog, Ticket } from "@intellimaintain/domain";

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

const variables =
        `* Ticket: ticket:pa123
* Priority: P4
* Project Id: P-6666
* System: EPX
* Environment: Acceptance

* Knowledge Article: ka:deleteProject 
* Approver: mr.approver@example.com
* Database:
  * username: EPX_DB_ACC
  * password: environment variable 'EPX_DB_SECRET_PROD' 
`
export const startAppState: DemoChatState = {
  chatState1: blankChatState ( 'Operator', 'Wizard', kas, scs, tickets, variables ),
  chatState2: blankChatState ( 'Wizard', 'Operator', kas, scs, tickets, variables )
}