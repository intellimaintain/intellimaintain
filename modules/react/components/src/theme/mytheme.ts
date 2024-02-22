import { createTheme } from '@mui/material/styles';
import { Theme, ThemeOptions } from "@mui/material";

export interface WizardOfOz {
  wizardOfOz: {
    topPartHeight: string
    bottomPartHeight: string
    elevation: number
  }
}
const rawTheme: ThemeOptions = ({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    // Define your typography adjustments here
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
})
function calcTheme (): Theme {
  const topPartHeight = '40vh';
  const bottomPartHeight = `40vh`;
  const wizardOfOz: WizardOfOz = {
    wizardOfOz: {
      topPartHeight,
      bottomPartHeight,
      elevation: 4
    }
  }
  const options: ThemeOptions = { ...rawTheme, ...wizardOfOz }
  return createTheme ( options as ThemeOptions );
}
export const theme = calcTheme ()


