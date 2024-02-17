import React, { ReactNode } from 'react';
import { Typography, Paper } from '@mui/material';

interface WithTitleProps {
  title: string;
  children: ReactNode;
}

export const WithTitle: React.FC<WithTitleProps> = ( { title, children } ) => {
  return (
    <Paper elevation={3} sx={{ margin: '20px', padding: '20px', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

