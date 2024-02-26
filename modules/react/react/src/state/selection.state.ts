import { ChatTempSpace, LdapTempSpace, SqlTempSpace, EmailTempSpace } from "@intellimaintain/react_conversation";
import { Action } from "@intellimaintain/actions";

export interface SelectionState {
  workspaceTab?: string
  action?: Action
  topBottomSlider?: number
  chatTempSpace?: ChatTempSpace
  sqlTempSpace?: SqlTempSpace
  ldapTempSpace?: LdapTempSpace
  emailTempSpace?: EmailTempSpace
}

