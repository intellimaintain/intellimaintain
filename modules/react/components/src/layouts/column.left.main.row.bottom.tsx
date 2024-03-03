import React, { ReactNode } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { LensProps } from "@focuson/state";
import MenuIcon from '@mui/icons-material/Menu';

interface CLRMBLayoutProps {
  height?: string;
  drawerWidth?: string;
}

export interface ColumnLeftMainRowBottomProps<S> extends LensProps<S, ColumnLeftMainState, any> {
  title: string
  Nav: ReactNode;
  Main: ReactNode;
  Typing: ReactNode;
  layout?: CLRMBLayoutProps;
}

export interface ColumnLeftMainState {
  drawerOpen?: boolean;
}
interface LayoutProps {
  Nav: React.ReactNode;
  Main: React.ReactNode;
  Typing: React.ReactNode;
  layout: CLRMBLayoutProps;
}

export function ColumnLeftMainRowBottom<S> ( { state,title, Nav, Main, Typing, layout }: ColumnLeftMainRowBottomProps<S> ) {
  const drawerOpenState = state.focusOn ( 'drawerOpen' )
  const drawerOpen = drawerOpenState.optJson () === undefined ? true : drawerOpenState.optJson ();
  const targetDrawerWidth = layout?.drawerWidth || '240px';
  const drawerWidth = drawerOpen ? targetDrawerWidth : '100px';

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
          {Main}
        </Box>
        <Box component="footer" sx={{mt: 'auto', bgcolor: 'background.paper', }}>
          {Typing}
        </Box>
      </Box>
    </Box>
  );
}
