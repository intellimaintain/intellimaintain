import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import React from "react";

export interface StatusIndicatorProps {
  value: boolean | undefined

}
export const StatusIndicator = ( { value }: StatusIndicatorProps ) => {
  let icon;
  switch ( value ) {
    case true:
      icon = <CheckIcon style={{ color: 'green' }}/>;
      break;
    case false:
      icon = <CloseIcon style={{ color: 'red' }}/>;
      break;
    default:
      icon = <HourglassEmptyIcon style={{ color: 'gray' }}/>;
  }

  return <div>{icon}</div>;
};