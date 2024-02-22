import { LensProps, LensProps2 } from "@focuson/state";
import { SelectedAndList } from "../domain";
import { SideEffect } from "../../sideeffects/sideeffects";
import { ExperimentalKnowledgeArticle } from "@intellimaintain/domain";
import { DropdownAsTitle } from "../../components/DropdownAsTitle";
import { DisplayDebug } from "@intellimaintain/components";


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