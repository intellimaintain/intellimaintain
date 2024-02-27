import React from "react";
import { CommonState } from "./common.state";
import { LensProps } from "@focuson/state";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { SideEffect } from "@intellimaintain/react_core";
import { Action } from "@intellimaintain/actions";
import { makeSideeffectForMessage } from "@intellimaintain/components";

interface FakeSendButtonProps<S, S1> extends LensProps<S, S1, any> {
  icon: React.ReactNode
  actionName: string
  message: string
  children: string
}
export function FakeSendButton<S, S1 extends CommonState> ( { children, state, icon, actionName, message }: FakeSendButtonProps<S, S1> ) {
  const onClick = () => {
    state.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'workspaceTab' ).focus2On ( 'sideeffects' ).transformJson (
      oldTab => '',
      ( oldEvents: SideEffect[] ) => [ ...(oldEvents || []),
        makeSideeffectForMessage ( { message, who: 'fake' } ),
        {
          command: 'event',
          event: { "event": "setValue", "path": `ticketState.${actionName}`, "value": true, "context": {} }
        } ],
      'FakeSendButton' )
  }

  return <Button variant="contained" color="primary" endIcon={icon} onClick={onClick}>{children}</Button>
}
