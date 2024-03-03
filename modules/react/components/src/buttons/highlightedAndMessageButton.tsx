import { LensProps } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";

import React from "react";
import { Typography } from "@mui/material";
import { MessageButton } from "./messageButton";
import { BaseMessage } from "@intellimaintain/domain";

export interface HighlightedAndMessageButtonProps<S> extends LensProps<S, SideEffect[], any> {
  buttonText: string
  buttonMessage: BaseMessage
  children: React.ReactNode
}
export function HighlightedAndMessageButton<S> ( { state, buttonText, buttonMessage, children }: HighlightedAndMessageButtonProps<S> ) {
  return <><Typography style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px', marginTop: '8px', marginBottom: '8px' }}>
    {children}
  </Typography>
    <MessageButton label={buttonText} state={state} message={buttonMessage}/>
  </>
}