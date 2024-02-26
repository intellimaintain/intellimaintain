import { SelectionState } from "../state/selection.state";
import { Conversation } from "@intellimaintain/domain";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { SideEffect, SideeffectResult } from "@intellimaintain/react_core";
import { KnowledgeArticles } from "@intellimaintain/react_knowledge_articles";
import { SoftwareCatalogs } from "@intellimaintain/react_softwarecatalog"
import { Tickets } from "@intellimaintain/react_ticket";
import { Lenses } from "@focuson/lens";
import { Templates } from "@intellimaintain/react_templates";
import { CommonState } from "@intellimaintain/react_conversation";


export interface ChatState extends CommonState {
  who: string
  selectionState: SelectionState
  sideeffects: SideEffect[]
  log: SideeffectResult<any>[]
  conversation: Conversation
  sql: string[]
  kas: KnowledgeArticles
  scs: SoftwareCatalogs
  templates: Templates
  variables: NameAnd<Variables>
  tickets: Tickets
  ticketState: NameAnd<boolean>
}
export const idL = Lenses.identity<ChatState> ()
export const sideEffectsL = idL.focusOn ( 'sideeffects' )
export const logsL = idL.focusOn ( 'log' )


export function blankChatState ( chatter: string, tickets: Tickets, kas: KnowledgeArticles, scs: SoftwareCatalogs, templates: Templates ): ChatState {
  return {
    who: chatter,
    selectionState: {},
    sideeffects: [],
    log: [],
    conversation: { messages: [], chatter },
    sql: [],
    kas,
    scs,
    templates,
    tickets,
    variables: {},
    ticketState: {}
  }
}

