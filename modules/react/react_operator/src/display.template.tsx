import React from "react";
import { LensProps } from "@focuson/state";
import { EditAttributesTable, FocusedTextInput } from "@intellimaintain/components";
import { Operator } from "@intellimaintain/domain";


export function EditOperator<S> ( { state }: LensProps<S, Operator, any> ) {
  return <EditAttributesTable state={state} attributes={[]}>{
    ( k, s ) => {
      return [ <>{k}</>, <FocusedTextInput state={s}/> ]
    }
  }</EditAttributesTable>
}
