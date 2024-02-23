import { LensProps } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { Message } from "@intellimaintain/domain";
import React from "react";
import { Typography } from "@mui/material";
import { MessageButton } from "./messageButton";

export interface HighlightedAndMessageButtonProps<S> extends LensProps<S, SideEffect[], any> {
  buttonText: string
  buttonMessage: Message
  children: React.ReactNode
}
export function HighlightedAndMessageButton<S> ( { state, buttonText, buttonMessage, children }: HighlightedAndMessageButtonProps<S> ) {
  return <><Typography style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px', marginTop: '8px', marginBottom: '8px' }}>
    {children}
  </Typography>
    <MessageButton label={buttonText} state={state} message={buttonMessage}/>
  </>
}