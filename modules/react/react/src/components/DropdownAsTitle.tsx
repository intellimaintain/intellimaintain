import { Card, CardContent, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { ReactNode } from "react";
import { LensProps, LensProps2, LensState } from "@focuson/state";
import { SideEffect } from "../sideeffects/sideeffects";

import { SelectedAndList } from "../domain/domain";
import { SetIdEvent, SetValueEvent } from "@intellimaintain/events";
import { IdAndName } from "@intellimaintain/domain";
import { Loading } from "@intellimaintain/components";



//observations... it will take time to load the selected item
//we want to display loading while it is loading
//changing the selection will fire an event 'setId' with the new id
//the data should be in the id store!
//annoyingly the path is not the lens description... might want to change that...


export interface DropdownAsTitleProps<S, T extends IdAndName> extends LensProps2<S, SelectedAndList<T>, SideEffect[], any> {
  purpose: string
  path: string
  parser?: string
  children: ( state: LensState<S, T, any> ) => React.ReactElement
}
export function DropdownAsTitle<S, T extends IdAndName> ( { state, children, path, purpose, parser }: DropdownAsTitleProps<S, T> ) {
  const { selected, options } = state.optJson1 () || { options: [], item: undefined, selected: undefined }

  //export interface SelectedAndList<T extends IdAndName> {
  //   options: IdAndName[]
  //   selected: string
  //   item: T | undefined //might not be loaded
  // }

  function handleChange ( event: SelectChangeEvent<string>, child: ReactNode ): void {
    let id = event.target.value;
    if ( id ) {
      console.log ( 'handleChange', id, event.target.value, event.target.name, event.target )
      const setSelectedEvent: SetValueEvent = { event: 'setValue', path: path + '.selected', value: id, context: {} };
      const loadItemEvent: SetIdEvent = { event: 'setId', id, path: path + '.item', parser: parser || 'string', context: {} };
      state.transformJson (
        ( { options, selected, item } ) => ({ options, selected: id, item: undefined }),
        old => [ ...(old || []), { command: 'event', event: setSelectedEvent }, { command: 'event', event: loadItemEvent } ],
        `${purpose} selected ${id}` );
    }
  }
  return <Card variant="outlined">
    <CardContent>
      <Select
        value={selected || ''}
        onChange={handleChange}
        aria-label={`Select${purpose ? ' ' + purpose : ''}`}
        displayEmpty
        fullWidth
      > <MenuItem disabled value=""> <em>Please select a {purpose}</em> </MenuItem>
        {options.map ( ( option ) => (
          <MenuItem key={option.name} value={option.id}>{option.name}</MenuItem>
        ) )}
      </Select>
      <LoadingOr state={state.state1 ()} children={children}/>
    </CardContent></Card>
}

export interface LoadingOrProps<S, T extends IdAndName> extends LensProps<S, SelectedAndList<T>, any> {
  children: ( state: LensState<S, T, any> ) => React.ReactElement
}
export function LoadingOr<S, T extends IdAndName> ( { state, children }: LoadingOrProps<S, T> ) {
  const item = state.optJson ();
  if ( item === undefined || item.selected === undefined ) return <></>
  const newState: LensState<S, T | undefined, any> = state.focusOn ( 'item' )
  const castState = newState as LensState<S, T, any>;
  return item.item === undefined ? <Loading/> : children ( castState );
}
