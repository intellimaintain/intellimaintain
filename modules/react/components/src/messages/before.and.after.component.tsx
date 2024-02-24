import { LensProps, LensProps2, LensState2 } from "@focuson/state";
import { Message } from "@intellimaintain/domain";
import { SideEffect } from "@intellimaintain/react_core";
import { Typography } from "@mui/material";
import React from "react";

export interface BeforeAfterComponentProps<S> extends LensProps <S, Message, any> {
  regex: RegExp
  children: ( during: string ) => React.ReactNode

}
export function BeforeAfterComponent<S> ( { state, regex, children }: BeforeAfterComponentProps<S> ) {
  const message = state.json ( () => 'SqlDisplayPluginError' );
  const matches = message.message.match ( regex );
  if ( !matches ) return <div>SqlDisplayPluginError</div>
  const [ _, before, during, after ] = matches;
  return (
    <>
      {before && <Typography>{before}</Typography>}
      {children ( during )}
      {after && <Typography>{after}</Typography>}
    </>
  );
}