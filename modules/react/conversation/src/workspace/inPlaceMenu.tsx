import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CommonState, onClickAction } from './common.state';
import { LensProps, LensState } from "@focuson/state";
import { ActionStatus } from "@intellimaintain/actions";
import { SideEffect } from "@intellimaintain/react_core";
import { makeSideeffectForMessage } from "@intellimaintain/components/dist/src/messages/messaging";

export interface InPlaceMenuProps<S, S1 extends CommonState> extends LensProps<S, S1, any> {
  actionStatus: ActionStatus
  rootPath: string
  who: string
}

function setAction<S> ( state: LensState<S, SideEffect[], any>, rootPath: string, actionName: string, who: string, value: boolean ) {
  const path = rootPath + '.' + actionName
  state.transform ( old => [ ...(old || []),
    makeSideeffectForMessage ( { message: `Manually set ${actionName} to be ${value}`, who } ),
    { command: 'event', event: { event: 'setValue', path, value, context: {} } }
  ], '' )
}

export function InPlaceMenu<S, S1 extends CommonState> ( { state, actionStatus, rootPath, who }: InPlaceMenuProps<S, S1> ) {
  const [ anchorEl, setAnchorEl ] = useState ( null );
  const open = Boolean ( anchorEl );

  const handleClick = ( event ) => {
    setAnchorEl ( event.currentTarget );
  };

  const handleClose = () => {
    setAnchorEl ( null );
  };

  // You can define your own handler functions here
  const handleMenuClick = ( action ) => {
    console.log ( action ); // Placeholder for your action handling logic
    handleClose (); // Close the menu after action
  };

  const path = rootPath + '.' + actionStatus.actionName
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={onClickAction ( state, actionStatus )}>
          Do this action now
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl ( null );
          setAction ( state.focusOn ( 'sideeffects' ), rootPath, actionStatus.actionName, who, true );
        }}>
          I checked elsewhere and everything is OK
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl ( null );
          setAction ( state.focusOn ( 'sideeffects' ), rootPath, actionStatus.actionName, who, false );
        }}>
          I checked elsewhere and there is a problem
        </MenuItem>
      </Menu>
    </div>
  );
}

