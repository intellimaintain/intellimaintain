import React from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import CopyToClipboardButton from '../buttons/copy.clipboard.button';
import Paper from "@mui/material/Paper";
import { NameAnd } from "@laoban/utils";

export interface AttributeValue {
  attribute: string;
  value: string;

}

export interface AttributeTableProps {
  rows: NameAnd<string>
}

export const AttributeTable = ( { rows }: AttributeTableProps ) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="sql data values" size="small">
        <TableBody sx={{ padding: '1px 1px', fontSize: '0.675rem', lineHeight: '1' }}>
          {Object.entries ( rows ).map ( ( [ attribute, value ], index ) => (
            <TableRow key={index} sx={{ height: 'auto' }}>
              <TableCell>{attribute}</TableCell>
              <TableCell>{value}</TableCell>
              <TableCell align="right">
                <CopyToClipboardButton textToCopy={value}/>
              </TableCell>
            </TableRow>
          ) )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};