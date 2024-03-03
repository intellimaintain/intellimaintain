import { LensProps } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import React from "react";
import { makeSideeffectForMessage } from "../messages/messaging";
import { BaseMessage } from "@intellimaintain/domain";

export interface MessageButtonProps<S> extends LensProps<S, SideEffect[], any> {
  label: string;
  message: BaseMessage
  disabled?: boolean
}
export function MessageButton<S> ( { state, label, message,disabled }: MessageButtonProps<S> ) {
  return <button disabled={disabled} onClick={e => state.transform (
    old => [ ...(old ?? []), makeSideeffectForMessage ( message ) ], '' )}>{label}</button>

}
