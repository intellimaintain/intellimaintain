import React from "react";
import { LensProps, LensProps2 } from "@focuson/state";
import { SelectedAndList, SideEffect } from '@intellimaintain/react_core';
import { ExperimentalKnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { DisplayDebug, DropdownAsTitle } from "@intellimaintain/components";

export type EKnowledgeArticles = SelectedAndList<ExperimentalKnowledgeArticle>

export function DisplayEKnowledgeArticle<S> ( { state }: LensProps<S, ExperimentalKnowledgeArticle, any> ) {
  const ka = state.json ()
  return <DisplayDebug state={state}/>
}
export function DisplayEKnowledgeArticles<S> ( { path, state }: LensProps2<S, EKnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='eka'>{
    state => <DisplayEKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}