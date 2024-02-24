import { Paper } from "@mui/material";
import React from "react";

export interface DisplayTextProps {
  text: string
  maxHeight?: string
}
export function DisplayText ( { text, maxHeight }: DisplayTextProps ) {
  return <Paper elevation={3} sx={{ margin: '20px', padding: '20px', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
    <pre>{text}</pre>
  </Paper>
}
