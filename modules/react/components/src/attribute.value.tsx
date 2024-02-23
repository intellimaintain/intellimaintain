import React from 'react';
import { Grid, Typography } from '@mui/material';

export interface AttributeValueProps {
  attribute: string;
  value: string;
}

export const AttributeValue = ( { attribute, value }: AttributeValueProps ) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography variant="body1">{attribute}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2">{value}</Typography>
      </Grid>
    </Grid>
  );
};


