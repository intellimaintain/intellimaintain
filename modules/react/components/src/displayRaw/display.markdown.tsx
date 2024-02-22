import React from 'react';
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';

export interface MarkdownDisplayProps<S> {
  md: string | undefined
  maxHeight: string
}
export function DisplayMarkdown<S> ( { md, maxHeight }: MarkdownDisplayProps<S> ) {
  return (
    <Box
      sx={{
        mt: 2, // Margin top of 2 spacing units
        maxHeight, // Example maximum height, adjust as needed
        overflow: 'auto', // Enables scrolling
        border: '1px solid #ccc', // Optional: adds a border around the Box
        padding: '8px', // Optional: adds some padding inside the Box
        fontFamily: 'monospace', // Ensures content is displayed in monospace font
      }}
    >
      <ReactMarkdown>{md || ''}</ReactMarkdown>
    </Box>
  );
}
