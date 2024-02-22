import { LensProps, LensProps2 } from "@focuson/state";
import { SelectedAndList } from "../domain";
import { SideEffect } from "../../sideeffects/sideeffects";
import React from "react";
import { ExperimentalKnowledgeArticle } from "@intellimaintain/domain";
import { DropdownAsTitle } from "../../components/DropdownAsTitle";
import { DisplayDebug } from "../../state/state.display";
import { isAdjustDatabaseSqlKS } from "@intellimaintain/domain/dist/src/ks";


export type EKnowledgeArticles = SelectedAndList<ExperimentalKnowledgeArticle>

export function DisplayEKnowledgeArticle<S> ( { state }: LensProps<S, ExperimentalKnowledgeArticle, any> ) {
  const ka = state.json ()
    return <DisplayDebug state={  state}/>
}
export function DisplayEKnowledgeArticles<S> ( { path, state }: LensProps2<S, EKnowledgeArticles, SideEffect[], any> & { path: string } ) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='eka'>{
    state => <DisplayEKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}