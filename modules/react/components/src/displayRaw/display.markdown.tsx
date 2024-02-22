import React from 'react';
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';

export interface MarkdownDisplayProps<S> {
  md: string | undefined
  maxHeight?: string
}
export function DisplayMarkdown<S> ( { md, maxHeight }: MarkdownDisplayProps<S> ) {
  return (
    <Box
      sx={{
        maxHeight, // Example maximum height, adjust as needed
        overflow: 'auto', // Enables scrolling
        padding: '8px', // Optional: adds some padding inside the Box
        fontFamily: 'monospace', // Ensures content is displayed in monospace font
      }}
    >
      <ReactMarkdown>{md || ''}</ReactMarkdown>
    </Box>
  );
}
