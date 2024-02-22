import React from "react";
import { Box } from "@mui/material";


export interface DisplayJsonProps {
  json: any
  maxHeight: string
}
export function DisplayJson ( { json, maxHeight }: DisplayJsonProps ) {
  // Style object for the Box component
  return (
    <Box style={{
      maxHeight, // Example maximum height, adjust as needed
      overflowY: 'scroll',
      border: '1px solid #ccc', // Optional: adds a border around the Box
      padding: '8px', // Optional: adds some padding inside the Box
      marginTop: '10px', // Optional: adds margin at the top
      marginBottom: '10px', // Optional: adds margin at the bottom
      fontFamily: 'monospace', // Ensures JSON is displayed in monospace font
    }}>
      <pre>{JSON.stringify ( json || {}, null, 2 )}</pre>
    </Box>
  );
}
