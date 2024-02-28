import React from "react";

import { LensProps } from "@focuson/state";
import { Button } from "@mui/material";
import { CommonState, SideEffect } from "@intellimaintain/react_core";
import { makeSideeffectForMessage } from "@intellimaintain/components";

interface FakeSendButtonProps<S, S1> extends LensProps<S, S1, any> {
  icon: React.ReactNode
  actionName: string
  message: string
  children: string
  value: boolean
}
export function FakeSendButton<S, S1 extends CommonState> ( { children, state, icon, actionName, message, value }: FakeSendButtonProps<S, S1> ) {
  const onClick = () => {
    state.doubleUp ().focus1On ( 'selectionState' ).focus1On ( 'workspaceTab' ).focus2On ( 'sideeffects' ).transformJson (
      oldTab => '',
      ( oldEvents: SideEffect[] ) => [ ...(oldEvents || []),
        makeSideeffectForMessage ( { message, who: 'fake' } ),
        {
          command: 'event',
          event: { "event": "setValue", "path": `ticketState.${actionName}`, value, "context": {} }
        } ],
      'FakeSendButton' )
  }

  return <Button variant="contained" color="primary" endIcon={icon} onClick={onClick}>{children}</Button>
}
