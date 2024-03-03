import { LensProps, LensState } from "@focuson/state";
import { ItsmState } from "../state/itsm.state";
import { FocusOnToggleButton } from "@intellimaintain/components";
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

export function GuiNav<S> ( { state }: LensProps<S, ItsmState, any> ) {
  return <>
    <div>Settings/tickets</div>
    <FocusOnToggleButton aria-label='Toggle Developer Mode' startIcon={<DeveloperModeIcon/>} state={state.focusOn ( 'debug' ).focusOn ( 'showDevMode' )}>Developer Mode</FocusOnToggleButton>
  </>
}