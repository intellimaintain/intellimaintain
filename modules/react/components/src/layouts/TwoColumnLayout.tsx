import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";

interface TwoColumnLayoutProps {
  children: [ React.ReactNode, React.ReactNode ];
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ( { children } ) => {
  if ( React.Children.count ( children ) !== 2 ) {
    console.error ( "TwoColumnLayout requires exactly two children." );
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {React.Children.map ( children, ( child, index ) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={3} style={{ padding: 20, height: '100%', overflow: 'auto' }}>
              {child}
            </Paper>
          </Grid>
        ) )}
      </Grid>
    </Box>
  );
};
