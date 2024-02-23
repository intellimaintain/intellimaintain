import React from "react";
import { LensProps, LensProps2, LensState } from "@focuson/state";
import { SelectedAndList, SideEffect } from '@intellimaintain/react_core';
import { AdjustDatabaseSqlKS, isAdjustDatabaseSqlKS, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { DisplayDebug, DisplayYaml, DropdownAsTitle } from "@intellimaintain/components";

export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>
function AdjustDatabaseSqlKs<S> ( { state }: LensProps<S, AdjustDatabaseSqlKS, any> ) {
  const ka = state.json ()
  const sql = ka.sql
  const woSql = { ...ka, sql: undefined }
  return <div>
    <DisplayDebug state={state.focusOn ( 'sql' )}/>
    <hr/>
    <DisplayYaml yamlContent={woSql} maxHeight='30vh'/>
  </div>;
}
export function DisplayKnowledgeArticle<S> ( { state }: LensProps<S, KnowledgeArticle, any> ) {
  const ka = state.json ()
  if ( isAdjustDatabaseSqlKS ( ka ) ) return <AdjustDatabaseSqlKs state={state as LensState<S, AdjustDatabaseSqlKS, any>}/>
  return <DisplayYaml yamlContent={ka} />
}
export function DisplayKnowledgeArticles<S> ( { path, state }: LensProps2<S, KnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='ka'>{
    state => <DisplayKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}