import { DI } from "./di";
import { ChatState } from "../domain/domain";
import { ChatEntryWorkspace, DashBoardData, DashboardWorkspace, dereferencePlugIn, emailDisplayPlugin, EmailTempSpace, EmailWorkspace, LdapTempSpace, LdapWorkspace, QuickData, QuickWorkspace, ReceiveEmailWorkspace, sqlDataDisplayMessagePlugin, sqlDisplayMessagePlugin, SqlTempSpace, SqlWorkspace } from "@intellimaintain/react_conversation";
import { LensState } from "@focuson/state";
export const defaultDi: DI<ChatState> = {
  displayPlugins: [ sqlDisplayMessagePlugin,
    emailDisplayPlugin, dereferencePlugIn,
    sqlDataDisplayMessagePlugin ],
  defaultPlugin: DashboardWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): DashBoardData<ChatState, ChatState> => {
    let qd: DashBoardData<ChatState, ChatState> = { state };
    return qd
  } ),
  workspacePlugins: [
    QuickWorkspace<ChatState> ( ( s: LensState<any, ChatState, any> ): QuickData<ChatState> => {
      const state = s.doubleUp ().focus1On ( 'variables' ).focus2On ( 'sideeffects' )
      const knowledgeArticle = s.focusOn ( 'kas' ).optJson ()?.item
      const ticket = s.focusOn ( 'tickets' ).optJson ()?.item
      let qd: QuickData<ChatState> = { state, knowledgeArticle, ticket };
      console.log ( 'qd', qd )
      return qd
    } ),
    ChatEntryWorkspace<ChatState> ( s => s.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'chatTempSpace' ).focus2On ( 'sideeffects' ) ),
    SqlWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): SqlTempSpace<ChatState, ChatState> => {
      let qd: SqlTempSpace<ChatState, ChatState> = { state };
      return qd
    } ),
    LdapWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): SqlTempSpace<ChatState, ChatState> => {
      let qd: LdapTempSpace<ChatState, ChatState> = { state };
      return qd
    } ),

    EmailWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): EmailTempSpace<ChatState, ChatState> => {
      let qd: EmailTempSpace<ChatState, ChatState> = { state };
      return qd
    } ),
    ReceiveEmailWorkspace<ChatState, ChatState> ( ( state: LensState<any, ChatState, any> ): ReceiveEmailWorkspace<ChatState, ChatState> => {
      let qd: ReceiveEmailWorkspace<ChatState, ChatState> = { state };
      return qd
    } ),

  ]

}