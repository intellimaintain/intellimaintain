import { LensProps } from "@focuson/state";
import React from "react";
import { Button, ButtonProps } from "@mui/material";

export interface FocusOnSetStringButtonProps<S> extends LensProps<S, string, any>, ButtonProps {
  title?: string
  value?: string
}
export function FocusOnSetStringButton<S> ( { state, title, value, children, ...rest }: FocusOnSetStringButtonProps<S> ) {
  return <Button {...rest} variant="contained"
                 onClick={() => {
                   console.log ( 'FocusOnSetStringButton onClick state', state );
                   state.setJson ( value, '' );
                 }}>{children || title || 'Toggle'}</Button>

}
