import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


interface CopyToClipboardButtonProps {
  textToCopy: string;
  onCopy?: ( s: string ) => void;
}

export function CopyToClipboardButton ( { textToCopy, onCopy }: CopyToClipboardButtonProps ) {
  const copyToClipboard = async ( text: string ) => {
    try {
      await navigator.clipboard.writeText ( text );
      if ( onCopy ) onCopy ( text );
    } catch ( error ) {
      console.error ( 'Failed to copy text: ', text, error );
    }
  };

  return (
    <Tooltip title="Copy to clipboard" enterDelay={300}>
      <IconButton
        onClick={() => copyToClipboard ( textToCopy )}
        aria-label="copy to clipboard"
      >
        <ContentCopyIcon/>
      </IconButton>
    </Tooltip>
  );
}

export default CopyToClipboardButton;
