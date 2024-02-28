import React from "react";
import { LensProps, LensProps2 } from "@focuson/state";
import { SideEffect } from '@intellimaintain/react_core';
import { KnowledgeArticle, KnowledgeArticles } from "@intellimaintain/knowledge_articles";
import { DisplayYaml, DropdownAsTitle } from "@intellimaintain/components";


export function DisplayKnowledgeArticle<S> ( { state }: LensProps<S, KnowledgeArticle, any> ) {
  const ka = state.json ()
  return <DisplayYaml yamlContent={ka} />
}
export function DisplayKnowledgeArticles<S> ( { path, state }: LensProps2<S, KnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='ka'>{
    state => <DisplayKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}