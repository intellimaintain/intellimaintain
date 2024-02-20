
import { LensProps, LensProps2 } from "@focuson/state";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { SideEffect } from "../../sideeffects/sideeffects";
import { DropdownAsTitle } from "../../layouts/DropdownAsTitle";
import React from "react";
import { KnowledgeArticle, KnowledgeArticles } from "../ka/ka";
import { IdAndName, SelectedAndList } from "../domain";

export interface SoftwareCatalog extends IdAndName{
  body: string
}
export type SoftwareCatalogs = SelectedAndList<SoftwareCatalog>

export function DisplaySoftwareCatalog<S, C> ( { state }: LensProps<S, SoftwareCatalog, C> ) {
  const sc = state.json ()
  return <Box mt={2}>
    <ReactMarkdown>{sc.body}</ReactMarkdown>
    </Box>
}

export function DisplaySoftwareCatalogs<S> ( { state }: LensProps2<S, SoftwareCatalogs, SideEffect[], any> ) {
  return <DropdownAsTitle state={state} purpose='Software Catalog'>{
    state => <DisplaySoftwareCatalog state={state}/>
}</DropdownAsTitle>
}