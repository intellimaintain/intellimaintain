import { LensProps2 } from "@focuson/state";

import React from "react";
import { KnowledgeArticle } from "@intellimaintain/domain";
import { DisplayMarkdown, DropdownAsTitle } from "@intellimaintain/components";
import { SelectedAndList, SideEffect } from "@intellimaintain/react_core";


export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>


export function DisplayKnowledgeArticles<S> ( { path, state }: LensProps2<S, KnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='ka'>{
    state => <DisplayMarkdown md={state.focusOn ( 'body' ).optJson ()} maxHeight='35vh'/>
  }</DropdownAsTitle>
}