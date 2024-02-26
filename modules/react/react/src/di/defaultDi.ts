import { DI } from "./di";
import { ChatState } from "../domain/domain";
import { ChatEntryWorkspace, DashBoardData, DashboardWorkspace, dereferencePlugIn, emailDisplayPlugin, EmailWorkspace, LdapWorkspace, QuickData, QuickWorkspace, sqlDataDisplayMessagePlugin, sqlDisplayMessagePlugin, SqlWorkspace } from "@intellimaintain/react_conversation";
import { LensState } from "@focuson/state";


export const defaultDi: DI<ChatState> = {
  displayPlugins: [ sqlDisplayMessagePlugin,
    emailDisplayPlugin, dereferencePlugIn,
    sqlDataDisplayMessagePlugin ],
  defaultPlugin: DashboardWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): DashBoardData<ChatState, ChatState> => {
    let qd: DashBoardData<ChatState, ChatState> = { state };
    console.log ( 'qd', qd )
    return qd
  } ),
  workspacePlugins: [
    QuickWorkspace<ChatState> ( ( s: LensState<any, ChatState, any> ): QuickData<ChatState> => {
      const state = s.doubleUp ().focus1On ( 'variables' ).focus2On ( 'sideeffects' )
      const knowledgeArticle = s.focusOn ( 'kas' ).optJson ()?.item
      const ticket = s.focusOn ( 'tickets' ).optJson ()?.item
      let qd = { state, knowledgeArticle, ticket };
      console.log ( 'qd', qd )
      return qd
    } ),
    ChatEntryWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'chatTempSpace' ).focus2On ( 'sideeffects' ) ),
    SqlWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'sqlTempSpace' ).focus2On ( 'sideeffects' ) ),
    LdapWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'ldapTempSpace' ).focus2On ( 'sideeffects' ) ),
    EmailWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'emailTempSpace' ).focus2On ( 'sideeffects' ) ),
  ]

}