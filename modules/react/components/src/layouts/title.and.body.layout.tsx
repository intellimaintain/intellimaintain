import React from 'react';
import { Box } from '@mui/material';

export interface TitleAndBodyProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
  height: string; // This can be any valid CSS height value (e.g., '500px', '100%', etc.)
}

export function TitleAndBody ( { top, bottom, height }: TitleAndBodyProps ) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: height, }}>
      <Box sx={{ mb: 1 }}>{top}</Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>{bottom}</Box>
    </Box>
  );
}

