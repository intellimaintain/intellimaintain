import { ChatTempSpace, LdapTempSpace, SqlTempSpace ,EmailTempSpace} from "@intellimaintain/react_conversation";

export interface SelectionState {
  mainTab?: number
  workspaceTab?: number
  topBottomSlider?: number
  chatTempSpace?: ChatTempSpace
  sqlTempSpace?: SqlTempSpace
  ldapTempSpace?: LdapTempSpace
  emailTempSpace?: EmailTempSpace
}

