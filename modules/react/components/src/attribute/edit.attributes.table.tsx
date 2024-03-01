import React from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import CopyToClipboardButton from '../buttons/copy.clipboard.button';
import Paper from "@mui/material/Paper";
import { NameAnd } from "@laoban/utils";
import { LensProps, LensState } from "@focuson/state";
import ReactMarkdown from "react-markdown";
import children = ReactMarkdown.propTypes.children;

export interface AttributeValueProps<S, T> extends LensProps<S, T, any> {
  attributes?: (keyof T) []
  children: <K extends keyof T>( k: K, state: LensState<S, T[K], any> ) => [ React.ReactNode, React.ReactNode ]
  clip?: boolean
}


export function EditAttributesTable<S, T extends object> ( { state, attributes, children, clip }: AttributeValueProps<S, T> ) {
  const main = state.optJson () ||{} as any as T
  if (typeof main !== 'object') return <Typography>Not an object{JSON.stringify(main)}</Typography>
  const actualAttributes = attributes || (Object.keys ( main ) as any as (keyof T) [])
  return (
    <TableContainer component={Paper}>
      <Table aria-label="sql data values" size="small">
        <TableBody sx={{ padding: '1px 1px', fontSize: '0.675rem', lineHeight: '1' }}>
          {actualAttributes.map ( attribute => {
            const [ attrChild, valueChild ] = children ( attribute, state.focusOn ( attribute ) )
            const value = main && main[ attribute ]
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