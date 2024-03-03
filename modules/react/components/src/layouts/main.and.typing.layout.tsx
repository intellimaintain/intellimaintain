import { Box, Toolbar } from "@mui/material";
import React, { ReactNode } from "react";
import { LensProps } from "@focuson/state";
import { calcDrawer, ColumnLeftMainState, SideDrawerLayoutProps } from "./column.left.main.bottom";

export interface MainAndTypingLayoutProps {
  Main: ReactNode;
  Typing: ReactNode;
}
export function MainAndTypingLayout<S> ( { Main, Typing }: MainAndTypingLayoutProps ) {
  return <Box component="main"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                p: 3,
              }}>
    <Box sx={{ overflowY: 'auto', flexGrow: 1, }}>
      <Toolbar/> {/* Ensures alignment and can be used for additional top padding if needed */}
      {Main}
    </Box>
    <Box component="footer" sx={{ mt: 'auto', bgcolor: 'background.paper', }}>
      {Typing}
    </Box>
  </Box>
}