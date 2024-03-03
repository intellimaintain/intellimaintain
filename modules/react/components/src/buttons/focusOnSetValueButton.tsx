import { LensProps } from "@focuson/state";
import React from "react";
import { Button, ButtonProps } from "@mui/material";

export interface FocusOnSetValueButtonProps<S,T> extends LensProps<S, T, any>, ButtonProps {
  title?: string
  valueToSet: T
}
export function FocusOnSetValueButton<S,T> ( { state, title, valueToSet, children, ...rest }: FocusOnSetValueButtonProps<S,T> ) {
  return <Button {...rest} variant="contained"
                 onClick={() => {
                   console.log ( 'FocusOnSetValueButton onClick state', state );
                   state.setJson ( valueToSet, '' );
                 }}>{children || title || 'Toggle'}</Button>

}
