import React from "react";
import { QueryResponseLayout } from "@intellimaintain/components";
import { LensProps } from "@focuson/state";
import { HasSqlWorkbenchState } from "@intellimaintain/react_core";

export interface DisplaySqlWorkbenchProps<S, S1> extends LensProps<S, S1, any> {
}

export function DisplaySqlWorkbenchForRaw<S, S1 extends HasSqlWorkbenchState> ( { state }: DisplaySqlWorkbenchProps<S, S1> ) {
  return <QueryResponseLayout
    requestTitle={"SQL"}
    request={null}
    requestButtons={[]}

    responseTitle={"Result"}
    response={null}
    responseButtons={[]}
  />
}

export function DisplaySqlWorkbenchForAction<S, S1 extends HasSqlWorkbenchState> ( { state }: DisplaySqlWorkbenchProps<S, S1> ) {
  return <QueryResponseLayout
    requestTitle={"SQL"}
    request={null}
    requestButtons={[]}

    responseTitle={"Result"}
    response={null}
    responseButtons={[]}
  />
}
export function DisplaySqlWorkbench<S, S1 extends HasSqlWorkbenchState> ( { state }: DisplaySqlWorkbenchProps<S, S1> ) {
  return <QueryResponseLayout
    requestTitle={"SQL"}
    requestText={"SQL to execute"}
    request={null}
    requestButtons={[]}

    responseTitle={"SQL Result"}
    responseText={"SQL Result"}
    response={null}
    responseButtons={[]}
  />
}