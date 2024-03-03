import React from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import CopyToClipboardButton from '../buttons/copy.clipboard.button';
import Paper from "@mui/material/Paper";
import { NameAnd } from "@laoban/utils";
import { LensProps, LensState } from "@focuson/state";
import ReactMarkdown from "react-markdown";
import children = ReactMarkdown.propTypes.children;
import { splitAndCapitalize } from "@intellimaintain/utils";

export interface AttributeValueProps<S, T> extends LensProps<S, T, any> {
  attributes?: Record<keyof T, AttributeDetails>
  children: <K extends keyof T>( k: K, ad: AttributeDetails, state: LensState<S, T[K], any> ) => [ React.ReactNode, React.ReactNode ]
  clip?: boolean
}

export type AttributeDetails = {
  name?: string
  validate?: ( value: string ) => string[]
}


function makeAttributes<T extends object> ( t: T, attributes: Record<keyof T, AttributeDetails> | undefined ): Record<keyof T, AttributeDetails> {
  if ( attributes ) return attributes
  const keys: (keyof T)[] = Object.keys ( t ) as any as (keyof T)[]
  return keys.reduce ( ( acc, key ) => {
    acc[ key ] = { name: splitAndCapitalize ( key.toString () ) }
    return acc
  }, {} as Record<keyof T, AttributeDetails> )
}
export function EditAttributesTable<S, T extends object> ( { state, attributes, children, clip }: AttributeValueProps<S, T> ) {
  const main = state.optJson () || {} as any as T
  if ( typeof main !== 'object' ) return <Typography>Not an object{JSON.stringify ( main )}</Typography>
  const actualAttributes =makeAttributes(main, attributes)
  const entries: [ string, AttributeDetails ][] = Object.entries ( actualAttributes )
  return (
    <TableContainer component={Paper}>
      <Table aria-label="sql data values" size="small">
        <TableBody sx={{ padding: '1px 1px', fontSize: '0.675rem', lineHeight: '1' }}>
          {entries.map ( ( [ attribute, ad ] ) => {
            const key = attribute as keyof T
            const name = ad?.name || splitAndCapitalize ( attribute )
            const realAd = ad.name?ad: {...ad, name}
            const [ attrChild, valueChild ] = children ( key, realAd, state.focusOn ( key ) )
            const value: any = main && main[ key ]
            return (
              <TableRow key={attribute.toString ()} sx={{ height: 'auto' }}>
                <TableCell>{attrChild}</TableCell>
                <TableCell>{valueChild}</TableCell>
                {clip && value && <TableCell align="right">
                    <CopyToClipboardButton textToCopy={value.toString ()}/>
                </TableCell>}
              </TableRow>
            );
          } )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}