import React, { ReactNode } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { LensProps, LensState } from "@focuson/state";
import MenuIcon from '@mui/icons-material/Menu';

export interface SideDrawerLayoutProps {
  height?: string;
  drawerWidth?: string;
}

export interface ColumnLeftRowBottomProps<S> extends LensProps<S, ColumnLeftMainState, any> {
  title: string
  Nav: ReactNode;
  children: ReactNode;
  layout?: SideDrawerLayoutProps;
}

export interface ColumnLeftMainState {
  drawerOpen?: boolean;
}
export function calcDrawer<S> ( state: LensState<S, ColumnLeftMainState, any>, layout: SideDrawerLayoutProps |undefined){
  const drawerOpenState = state.focusOn ( 'drawerOpen' )
  const drawerOpen = drawerOpenState.optJson () === undefined ? true : drawerOpenState.optJson ();
  const targetDrawerWidth = layout?.drawerWidth || '240px';
  const drawerWidth = drawerOpen ? targetDrawerWidth : '100px';
  return { drawerOpenState, drawerOpen, drawerWidth };
}

export function ColumnLeftMainBottom<S> ( { state, title, Nav, children,layout }: ColumnLeftRowBottomProps<S> ) {
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
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
        }}
      >
        {children}
      </Box>
    </Box>)
}
