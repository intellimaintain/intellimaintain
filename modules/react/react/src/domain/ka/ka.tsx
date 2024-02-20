import { LensProps, LensProps2 } from "@focuson/state";
import { Box } from "@mui/material";
import { SelectedAndList } from "../domain";
import { SideEffect } from "../../sideeffects/sideeffects";
import { DropdownAsTitle } from "../../layouts/DropdownAsTitle";
import React from "react";
import ReactMarkdown from "react-markdown";
import { KnowledgeArticle } from "@intellimaintain/domain";


export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>

export function DisplayKnowledgeArticle<S, C> ( { state }: LensProps<S, KnowledgeArticle, C> ) {
  const ka = state.json ()
  return <Box mt={2}>
    <ReactMarkdown>{ka.body}</ReactMarkdown>
  </Box>
}

export function DisplayKnowledgeArticles<S> ( { path,state }: LensProps2<S, KnowledgeArticles, SideEffect[], any>&{path: string}) {
  return <DropdownAsTitle path={path} state={state} purpose='Knowledge Article' parser='ka'>{
    state => <DisplayKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}