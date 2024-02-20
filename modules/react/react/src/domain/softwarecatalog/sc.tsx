import { LensProps, LensProps2 } from "@focuson/state";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { SideEffect } from "../../sideeffects/sideeffects";
import { DropdownAsTitle } from "../../layouts/DropdownAsTitle";
import React from "react";
import { SoftwareCatalog } from "@intellimaintain/domain";
import { SelectedAndList } from "../domain";


export type SoftwareCatalogs = SelectedAndList<SoftwareCatalog>

export function DisplaySoftwareCatalog<S, C> ( { state }: LensProps<S, SoftwareCatalog, C> ) {
  const sc = state.json ()
  return <Box mt={2}>
    <ReactMarkdown>{sc.body}</ReactMarkdown>
    </Box>
}

export function DisplaySoftwareCatalogs<S> ( { state, path }: LensProps2<S, SoftwareCatalogs, SideEffect[], any> &{path:string}) {
  return <DropdownAsTitle state={state} path={path} purpose='Software Catalog' parser='sc'>{
    state => <DisplaySoftwareCatalog state={state}/>
}</DropdownAsTitle>
}