import { Action } from "@intellimaintain/actions";
import { Button } from "@mui/material";
import { uppercaseFirstLetter } from "@intellimaintain/utils";
import React from "react";
import { LensProps } from "@focuson/state";
import { SelectionStateForActions } from "./action.selection.state";

export interface ActionButtonProps<S> extends LensProps<S, SelectionStateForActions, any> {
  action: Action

}
export function ActionButton<S> ( { action, state }: ActionButtonProps<S> ) {
  return <Button
    variant="contained" // Gives the button a background color
    color="primary" // Use the theme's primary color
    fullWidth
    onClick={() => {state.focusOn ( 'workspaceTab' ).setJson ( uppercaseFirstLetter ( action.by.toLowerCase () ), action )}}
  >{action.by}</Button>
}