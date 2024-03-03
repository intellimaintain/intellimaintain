import { ChatTempSpace, EmailTempSpace, LdapTempSpace, SqlTempSpace } from "@intellimaintain/react_conversation";
import { Action } from "@intellimaintain/actions";
import { SqlWorkbenchState, WorkspaceSelectionState } from "@intellimaintain/react_core";
import { DatabaseConfigAndEnvironment } from "@intellimaintain/react_softwarecatalog";

export interface SelectionState extends WorkspaceSelectionState {
  action?: Action
  topBottomSlider?: number
  chatTempSpace?: ChatTempSpace
  sqlTempSpace?: SqlTempSpace<any, any>
  ldapTempSpace?: LdapTempSpace<any, any>
  emailTempSpace?: EmailTempSpace<any, any>
  sql?: SqlWorkbenchState
  sqlConfig?: DatabaseConfigAndEnvironment
}

