import { LensProps } from "@focuson/state";
import React from "react";
import { Button, ButtonProps } from "@mui/material";

export interface FocusOnToggleButtonProps<S> extends LensProps<S, boolean, any>, ButtonProps {
  title?: string
}
export function FocusOnToggleButton<S> ( { state, title, children, ...rest }: FocusOnToggleButtonProps<S> ) {
  return <Button {...rest} variant="contained"
                 onClick={() => {
                   console.log('FocusOnToggleButton onClick state', state);
                   state.setJson ( !state.optJson(), 'devmode' ); }}>{children || title || 'Toggle'}</Button>

}
