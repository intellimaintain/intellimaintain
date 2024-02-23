import { Box, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { AttributeValue } from "@intellimaintain/components";

export interface SqlDataProps {
  variables: any
}

export function SqlData ( { variables }: SqlDataProps ) {
  const environment = variables?.Environment?.toString () || '<No Environment>'
  const database = variables?.Database
  const type = database?.type?.toString () || '<No Type>'
  const name = database?.name?.toString () || '<No Name>'
  const user = database?.user?.toString () || '<No User>'
  const password = database?.password?.toString () || '<No Password>'
  return <Grid padding={2} container spacing={2}>
    <AttributeValue attribute="Environment" value={environment}/>
    <AttributeValue attribute="Database" value={`${type} ${name}`}/>
    <AttributeValue attribute="User" value={user}/>
    <AttributeValue attribute="Password" value={password}/>
  </Grid>
}

export function SqlDataAndTest ( { variables }: SqlDataProps ) {
  return <><SqlData variables={variables}/>
    <button>Test connection</button>
  </>
}