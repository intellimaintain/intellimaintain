import { ChatTempSpace, LdapTempSpace, SqlTempSpace, EmailTempSpace, WorkspaceSelectionState } from "@intellimaintain/react_conversation";
import { Action } from "@intellimaintain/actions";

export interface SelectionState extends WorkspaceSelectionState {
  action?: Action
  topBottomSlider?: number
  chatTempSpace?: ChatTempSpace
  sqlTempSpace?: SqlTempSpace
  ldapTempSpace?: LdapTempSpace
  emailTempSpace?: EmailTempSpace
}

