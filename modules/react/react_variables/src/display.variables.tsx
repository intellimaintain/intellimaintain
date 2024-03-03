import { Variables } from "@intellimaintain/variables";
import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { DisplayYaml } from "@intellimaintain/components";
import ErrorIcon from "@mui/icons-material/Error";
import { LensProps2 } from "@focuson/state";
import { NameAnd } from "@laoban/utils";
import { SideEffect } from "@intellimaintain/react_core";
import React from "react";

export type DisplayVariablesProps = {
  variables: Variables
}
export function DisplayVariablesFromOnePlace ( { variables }: DisplayVariablesProps ) {
  return <></>

}

export type VariablesCardProps = {
  variables: Variables
  title: string
}
function SectionCard ( { title, variables }: VariablesCardProps ) {
  return (
    <Card variant="outlined" style={{ margin: '16px 0' }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <DisplayYaml yamlContent={variables.variables}/>
        {variables.errors.length > 0 && <List>
          {variables.errors.map ( ( error, index ) => (
            <ListItem key={`error-${index}`} style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              <ListItemIcon>
                <ErrorIcon color="error"/>
              </ListItemIcon>
              <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2' }}/>
            </ListItem>
          ) )}</List>}
      </CardContent>
    </Card>
  );
}


export function DisplayVariables<S> ( { state }: LensProps2<S, NameAnd<Variables>, SideEffect[], any> ) {
  const variables = state.state1 ().optJson () || {}

  return <div style={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>
    <div style={{ flexGrow: 1, overflowY: 'scroll' }}>
      {Object.entries ( variables ).map ( ( [ title, variables ], index ) => (
        <SectionCard
          key={index}
          title={title}
          variables={variables}
        />
      ) )}
    </div>
  </div>
}