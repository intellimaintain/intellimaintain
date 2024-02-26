import { blankChatState, ChatState } from "./domain";
import { IdAndName } from "@intellimaintain/domain";
import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { Tickets } from "@intellimaintain/react_ticket";
import { SoftwareCatalogs } from "@intellimaintain/react_softwarecatalog"
import { Templates } from "@intellimaintain/react_templates";

// export const ticket1: IdAndName = { id: 'ticket:pa123', name: 'Ticket PA123' };
// export const ticket2: IdAndName = { id: 'ticket:pa124', name: 'Ticket PA124' };
let tickets: Tickets = {
  selected: undefined,
  item: undefined,
  options: []
}


export const kas: KnowledgeArticles = {
  selected: undefined,
  item: undefined,
  options: []
}


export const scs: SoftwareCatalogs = {
  selected: undefined,
  item: undefined,
  options: []
}
export const templates: Templates = {
  selected: undefined,
  item: undefined,
  options: []
}

export const startAppState: ChatState = blankChatState( 'phil@example.com', tickets, kas, scs, templates )