import { LensProps, LensProps2 } from "@focuson/state";
import { Box, Typography } from "@mui/material";
import { IdAndName, SelectedAndList } from "../domain";
import { SideEffect } from "../../sideeffects/sideeffects";
import { DropdownAsTitle } from "../../layouts/DropdownAsTitle";
import React from "react";
import ReactMarkdown from "react-markdown";

export interface KnowledgeArticle extends IdAndName {
  body: string
}
export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>

export function DisplayKnowledgeArticle<S, C> ( { state }: LensProps<S, KnowledgeArticle, C> ) {
  const ka = state.json ()
  return <Box mt={2}>
    <ReactMarkdown>{ka.body}</ReactMarkdown>
  </Box>
}

export function DisplayKnowledgeArticles<S> ( { state }: LensProps2<S, KnowledgeArticles, SideEffect[], any> ) {
  return <DropdownAsTitle state={state} purpose='Knowledge Article'>{
    state => <DisplayKnowledgeArticle state={state}/>
  }</DropdownAsTitle>
}