import { ChatTempSpace,SqlTempSpace } from "@intellimaintain/react_conversation";

export interface SelectionState {
  mainTab?: number
  workspaceTab?: number
  topBottomSlider?: number
  chatTempSpace?: ChatTempSpace
  sqlTempSpace?: SqlTempSpace
}

