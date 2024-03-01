import React from "react";
import { TextField } from "@mui/material";
import { TextFieldProps, TextFieldVariants } from "@mui/material/TextField/TextField";
import { LensState } from "@focuson/state";

export type FocusTextAreaProps<S> = TextFieldProps & {
  state: LensState<S, string, any>;
}

export function FocusedTextInput<S> ( props: FocusTextAreaProps<S> ) {
  const { state, ...rest } = props
  const value = state.optJson () || ''
  console.log ( 'FocusedTextInput', props )
  console.log ( 'FocusedTextInput', value, state, rest )
  return <TextField {...rest} value={value} onChange={e => state.setJson ( e?.target?.value, '' )}/>
}

export function FocusedTextArea<S> ( props: FocusTextAreaProps<S> ) {
  return <FocusedTextInput {...props} fullWidth variant='outlined' multiline rows={4}/>
}