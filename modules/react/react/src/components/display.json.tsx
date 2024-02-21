import { Box } from "@mui/material";


export interface DisplayJsonProps {
  json: any
  maxHeight: string
}
export function DisplayJson ( { json, maxHeight }: DisplayJsonProps ) {
  // Style object for the Box component
  const style = {
    maxHeight, // Example maximum height, adjust as needed
    overflow: 'auto', // Enables scrolling
    border: '1px solid #ccc', // Optional: adds a border around the Box
    padding: '8px', // Optional: adds some padding inside the Box
    marginTop: '10px', // Optional: adds margin at the top
    marginBottom: '10px', // Optional: adds margin at the bottom
    fontFamily: 'monospace', // Ensures JSON is displayed in monospace font
  };
  return (
    <Box style={style}>
      <pre>{JSON.stringify ( json || {}, null, 2 )}</pre>
    </Box>
  );
}
