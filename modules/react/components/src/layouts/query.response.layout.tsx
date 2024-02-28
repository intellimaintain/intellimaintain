import React, { ReactNode } from 'react';
import { Box, Grid, Typography } from '@mui/material';

export interface QueryResponseLayoutProps {
  requestTitle: string
  requestText?: string
  request: ReactNode
  requestButtons: ReactNode[]

  responseTitle: string
  responseText?: string
  response: ReactNode
  responseButtons: ReactNode[]
}

export function QueryResponseLayout ( { requestTitle, requestText, request, requestButtons, responseTitle, responseText, response, responseButtons }: QueryResponseLayoutProps ) {
  return  <Box>
    <Box mb={4}>
      <Typography variant="h6">{requestTitle}</Typography>
      <Typography>{requestText}</Typography>
      <Box my={2}>{request}</Box>
      <Grid container spacing={1}>
        {requestButtons.map((button, index) => (
          <Grid item key={index}>
            {button}
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box>
      <Typography variant="h6">{responseTitle}</Typography>
      <Typography>{responseText}</Typography>
      <Box my={2}>{response}</Box>
      <Grid container spacing={1}>
        {responseButtons.map((button, index) => (
          <Grid item key={index}>
            {button}
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
}
