import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import { LensProps } from "@focuson/state";

export interface TwoRowLayoutProps<S> extends LensProps<S, number, any>{
  children: [ReactElement , ReactElement]
}

// The TwoRowLayout HOC itself is a functional component
export function TwoRowLayout<S>({ state,children }: TwoRowLayoutProps<S>) {
  const [topChild, bottomChild] = children
  const topHeight=state.optJson()|| '30%'
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <Box sx={{ height: topHeight, overflow: 'auto', boxSizing: 'border-box' }}>
        {topChild}
      </Box>
      <Box
        sx={{  height: '4px', backgroundColor: 'lightgray', boxSizing: 'border-box' }}
      />
      <Box sx={{  }}>
        {bottomChild}
      </Box>
    </Box>
  );
}
