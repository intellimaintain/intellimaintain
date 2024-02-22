import React from "react";
import { LensProps, LensProps2 } from "@focuson/state";
import { SelectedAndList, SideEffect } from '@intellimaintain/react_core';
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { DisplayDebug, DropdownAsTitle } from "@intellimaintain/components";

export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>

export function DisplayKnowledgeArticle<S> ( { state }: LensProps<S, KnowledgeArticle, any> ) {
  const ka = state.json ()
  return <DisplayDebug state={state}/>
}
export function DisplayKnowledgeArticles<S> ( { path, state }: LensProps2<S, KnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='eka'>{
    state => <DisplayKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}