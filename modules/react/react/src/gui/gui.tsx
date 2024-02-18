import { DisplayConversation } from "../conversation/conversation.component";
import { LensProps } from "@focuson/state";
import { ChatState } from "../state/FullState";
import { SimpleTabPanel, TabPanel, TabsContainer } from "../layouts/TabPanel";
import { KnowledgeArticle } from "../ka/ka";
import { TwoRowLayout } from "../layouts/TwoRowLayout";
import { LogDisplay, DisplayDebug, StateDisplay } from "../state/state.display";
import { DisplayTicket } from "../ticket/ticket";


export interface DisplayGuiProps<S, C> extends LensProps<S, ChatState, C> {
  label: string
}
export function DisplayGui<S, C> ( { state, label }: DisplayGuiProps<S, C> ) {
  const parentState = state.doubleUp ().focus2On ( 'selectionState' ).focus2On ( 'mainTab' )
  return <TwoRowLayout state={state.focusOn ( 'selectionState' ).focusOn ( 'topBottomSlider' )}>
    <TabsContainer label={label} state={parentState}>
      <TabPanel focuson='ticket' state={parentState} title='Ticket'>{state => <DisplayTicket state={state}/>}</TabPanel>
      <TabPanel focuson='ka' state={parentState} title='KA'>{state => <KnowledgeArticle state={state}/>}</TabPanel>
      <TabPanel focuson='conversation' state={parentState} title='SQL'>{state => <pre>Some Sql</pre>}</TabPanel>
      <TabPanel focuson='log' state={parentState} title='Log'>{state => <LogDisplay state={state}/>}</TabPanel>
      <SimpleTabPanel title='Debug'><DisplayDebug state={state}/></SimpleTabPanel>
      <SimpleTabPanel title='State'><StateDisplay state={state}/></SimpleTabPanel>
    </TabsContainer>
    <DisplayConversation state={state.doubleUp ().focus1On ( 'conversation' ).focus2On ( 'sideeffects' )}/>
  </TwoRowLayout>
}
