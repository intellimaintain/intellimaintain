import { DisplayConversation } from "../conversation/conversation.component";
import { LensProps } from "@focuson/state";
import { ChatState } from "../state/FullState";
import { TableContainer } from "@mui/material";
import { TabPanel, TabsContainer } from "../layouts/TabPanel";
import { HasSendMessage } from "../DI/DI";
import { KnowledgeArticle } from "../ka/ka";
import { TwoRowLayout } from "../layouts/TwoRowLayout";


export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  label: string
}
export function DisplayGui<S, C extends HasSendMessage> ( { state, label }: DisplayGuiProps<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )
  return <TwoRowLayout state={state.focusOn ( 'selectionState' ).focusOn ( 'topBottomSlider' )}>
    <TabsContainer label={label} state={parentState}>
      <TabPanel focuson='ka' state={parentState} title='KA'>{state => <KnowledgeArticle state={state}/>}</TabPanel>
      <TabPanel focuson='conversation' state={parentState} title='SQL'>{state => <DisplayConversation state={state}/>}</TabPanel>
    </TabsContainer>
    <DisplayConversation state={state.focusOn ( 'conversation' )}/>
  </TwoRowLayout>
}
