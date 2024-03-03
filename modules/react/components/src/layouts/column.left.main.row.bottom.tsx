import React, { ReactNode } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { calcDrawer, ColumnLeftRowBottomProps } from "./column.left.main.bottom";


export interface ColumnLeftMainRowBottomProps<S> extends ColumnLeftRowBottomProps<S> {
  Typing: ReactNode;
}

export function ColumnLeftMainRowBottom<S> ( { state, title, Nav, children, Typing, layout }: ColumnLeftMainRowBottomProps<S> ) {
  const { drawerOpenState, drawerOpen, drawerWidth } = calcDrawer ( state, layout );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline/>
      <AppBar position="fixed" sx={{ zIndex: ( theme ) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => drawerOpenState.setJson ( !drawerOpen, '' )}
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      > <Toolbar/>
        {Nav}
      </Drawer>
      <Box component="main"
           sx={{
             display: 'flex',
             flexDirection: 'column',
             flexGrow: 1,
             p: 3,
             width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
           }}>
        <Box sx={{ overflowY: 'auto', flexGrow: 1, }}>
          <Toolbar/> {/* Ensures alignment and can be used for additional top padding if needed */}
          {children}
        </Box>
        <Box component="footer" sx={{ mt: 'auto', bgcolor: 'background.paper', }}>
          {Typing}
        </Box>
      </Box>
    </Box>
  );
}
