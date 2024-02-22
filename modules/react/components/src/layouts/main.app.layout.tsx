import React, { ReactNode } from 'react';
import { Box, Divider, Paper, Theme, useTheme } from '@mui/material';
import { WizardOfOz } from "../theme/mytheme";
import Grid from "@mui/material/Grid";


export interface MainAppLayoutProps {
  children: [ ReactNode, ReactNode ];
}
export function MainAppLayout ( { children } ) {
  const theme = useTheme<Theme & WizardOfOz> ();
  const [ topPart, bottomPart ] = children;
  const { topPartHeight, bottomPartHeight } = theme.wizardOfOz;

  return <div style={{ maxHeight: '100vh' }}>
    <Grid container direction="column" sx={{ height: '100%' }}>
      <Grid item xs={12} sx={{ flexGrow: 1, height: { topPartHeight } }}>
        <Box sx={{ padding: 2 }}> {topPart}</Box>
      </Grid>
      <Grid item xs={12} sx={{ flexGrow: 1, height: { bottomPartHeight } }}>
        <Box sx={{ padding: 2 }}>{bottomPart}</Box>
      </Grid>
    </Grid>
  </div>
}
