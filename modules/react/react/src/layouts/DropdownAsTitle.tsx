import { Card, CardContent, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { ReactNode } from "react";
import { LensProps2, LensState } from "@focuson/state";
import { SideEffect } from "../sideeffects/sideeffects";
import { LoadingOr } from "./LoadingOr";
import { IdAndName, SelectedAndList } from "../domain/domain";


//observations... it will take time to load the selected item
//we want to display loading while it is loading
//changing the selection will fire an event 'setId' with the new id
//the data should be in the id store!
//annoyingly the path is not the lens description... might want to change that...


export interface DropdownAsTitleProps<S, T extends IdAndName> extends LensProps2<S, SelectedAndList<T>, SideEffect[], any> {
  purpose: string
  children: ( state: LensState<S, T, any> ) => React.ReactElement
}
export function DropdownAsTitle<S, T extends IdAndName> ( { state, children, purpose }: DropdownAsTitleProps<S, T> ) {
  const { selected, options } = state.optJson1 () || { options: [], item: undefined, selected: undefined }
  function handleChange ( event: SelectChangeEvent<string>, child: ReactNode ): void {
    console.log ( 'handleChange', event, child )
  }

  return <Card variant="outlined">
    <CardContent>
      <Select
        value={selected || ''}
        onChange={handleChange}
        aria-label={`Select${purpose ? ' ' + purpose : ''}`}
        fullWidth
      > <MenuItem disabled value=""> <em>Please select a {purpose}</em> </MenuItem>
        {options.map ( ( option ) => (
          <MenuItem key={option.name} value={option.id}>{option.name}</MenuItem>
        ) )}
      </Select>
      <LoadingOr state={state.state1 ().focusOn ( 'item' )} children={children}/>
    </CardContent></Card>
}