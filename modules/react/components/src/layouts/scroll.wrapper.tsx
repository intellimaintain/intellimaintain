import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

export interface ScrollWrapperProps {
  height?: string;
  maxHeight?: string;
  children: ReactNode;
}

export function ScrollWrapper ( { children, maxHeight, height, }: ScrollWrapperProps ) {
  return (<Box sx={{ maxHeight, height, overflowY: 'auto' }}>{children}</Box>
  );
}

