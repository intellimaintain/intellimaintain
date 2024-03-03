import { LensProps } from "@focuson/state";
import { BaseMessage, isMessage } from "@intellimaintain/domain";
import { Typography } from "@mui/material";
import React from "react";

export interface BeforeAfterComponentProps<S> extends LensProps <S, BaseMessage, any> {
  regex: RegExp
  children: ( during: string ) => React.ReactNode

}
export function BeforeAfterComponent<S> ( { state, regex, children }: BeforeAfterComponentProps<S> ) {
  const message = state.json ( () => 'SqlDisplayPluginError' );
  if ( !isMessage ( message ) ) return <div>SqlDisplayPluginError: Not message {JSON.stringify ( message )}</div>
  const matches = message.message.match ( regex );
  if ( !matches ) return <div>SqlDisplayPluginError: Didn't match {JSON.stringify ( message )}</div>
  const [ _, before, during, after ] = matches;
  return (
    <>
      {before && <Typography>{before}</Typography>}
      {children ( during )}
      {after && <Typography>{after}</Typography>}
    </>
  );
}