import { LensProps2 } from "@focuson/state";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import React from "react";
import { SideEffect } from "../../sideeffects/sideeffects";

export type Variables = string

export function DisplayVariables<S> ( { state }: LensProps2<S, Variables, SideEffect[], any> ) {

  const variables = state.optJson1 () || ''
  return <Box mt={2}>
    <ReactMarkdown>{variables}</ReactMarkdown>
  </Box>

}