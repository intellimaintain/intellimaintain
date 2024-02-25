import { LensProps2, LensProps3, LensState3 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { WorkSpacePlugin, WorkspaceStateFn } from "./workspace";
import React from "react";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { NameAnd } from "@laoban/utils";
import { Variables } from "@intellimaintain/variables";
import { ChatButton } from "../chatbuttons/chatbuttons";



export function QuickWorkspace<Mid> ( dataFn: WorkspaceStateFn<Mid, LensState3<any, KnowledgeArticle | undefined, NameAnd<Variables>, SideEffect[], any>> ):
  WorkSpacePlugin<Mid, LensState3<any, KnowledgeArticle | undefined, NameAnd<Variables>, SideEffect[], any>> {
  return ({
    tabName: 'Quick',
    dataFn,
    display: DisplayQuick

  });
}

//interface UserTypingBoxProps<S, C> extends LensProps3<S, string, NameAnd<Variables>, SideEffect[], C> {
//   from: string
// }

export function DisplayQuick<S> ( { state }:LensProps3<any, KnowledgeArticle | undefined, NameAnd<Variables>, SideEffect[], any> ) {
  return <div>
    <p>The current knowledge article is <strong>{state.optJson1()?.name||'<unknown>'}</strong>. Is that correct. If not change it in the 'KSA' tab above</p>
    <ChatButton who='from quick' state={state} />
  </div>

}
