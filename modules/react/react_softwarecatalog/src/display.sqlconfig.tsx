import React from "react";
import { LensProps, LensState } from "@focuson/state";
import { DatabaseConfig } from "@intellimaintain/softwarecatalog";
import { EditAttributesTable, FocusedTextInput } from "@intellimaintain/components";
import { Button, Typography } from "@mui/material";
import { TestConnectionButton } from "./test.connection.button";

export interface DatabaseConfigAndEnvironment extends DatabaseConfig {
  system: string
  environment: string
}
export interface DisplaySqlConfigProps<S> extends LensProps<S, DatabaseConfigAndEnvironment, any> {
}

export function DisplaySqlConfig<S> ( { state }: DisplaySqlConfigProps<S> ) {
  return <>
    <Typography variant="h6">Configuring your database connection</Typography>
    <Typography>Please fill in the details for your system. If your system has a name in your ticketing system please use the same one. The same for the environment. It helps if the spelling is exactly the same</Typography>
    <Typography>The type is probably 'Oracle'</Typography>
    <Typography>The schema should be the actual schema for that environment</Typography>
    <Typography>The password is the name of the environment variable that holds the password</Typography>
    <EditAttributesTable state={state} attributes={[ 'system', 'environment', 'type', 'schema', 'user', 'password' ]}>{
      ( key, state ) =>
        [ <p>{key}</p>, <FocusedTextInput fullWidth state={state as LensState<S, any, any>}/> ]
    }</EditAttributesTable>
    <Button variant='contained'>Save</Button>
    <TestConnectionButton/>
  </>
}
