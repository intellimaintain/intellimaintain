import { LensProps } from "@focuson/state";
import { ChatState } from "../domain/domain";
import { DI } from "../di/di";
import { ThemeProvider } from "@mui/material";
import { theme } from "@intellimaintain/components";
import { DisplayGui } from "./gui";
import React from "react";
import { TemplateFn } from "@intellimaintain/components";

export interface AppProps<S> extends LensProps<S, ChatState, DI<S>> {
  templateFn: TemplateFn<S>
}
export function App<S> ( { state, templateFn }: AppProps<S> ) {
  return <ThemeProvider theme={theme}>
    <DisplayGui from='Operator' tabsHeight='45vh' path='chatState1.' template={templateFn} state={state}/>
  </ThemeProvider>
}
