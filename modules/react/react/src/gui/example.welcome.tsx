import { EditAttributesTable } from "@intellimaintain/components/dist/src/attribute/edit.attributes.table";
import { lensState } from "@focuson/state";
import { splitAndCapitalize, uppercaseFirstLetter } from "@intellimaintain/utils";
import { AccordionExplicitList, AccordionList } from "@intellimaintain/components";
import { NameAnd } from "@laoban/utils";

export interface WelcomeState {
  selected: string
}
export type WelcomeSelectionState = NameAnd<string>

const data = {
  you: "phil.rice@example.com",
  organisation: "Example Organisation - drop down and +1",
  ticket: "<No Ticket> - drop down and +1 .. but warning about the +1",
  system: "Pet store - drop down and +1",
  environment: "Production -  drop down and +1",
  LDAP: '<Not set up yet>',
  database: 'PET_STORE_PROD - drop down and +1',
}
type Data = typeof data
const selectionData: WelcomeSelectionState = {}

type FullData = {
  data: Data,
  selectionData: WelcomeSelectionState
}

const fullData: FullData = { data, selectionData }

export function ExampleWelcome () {
  const state = lensState<FullData, {}> ( fullData, () => {}, '', {} )
  return (
    <div>
      <h1>Welcome to the Example</h1>
      <p>This feels like an accordion!</p>
      <AccordionExplicitList name='profile' list={['name', 'email']} state={state.focusOn ( 'selectionData' ).doubleUp ().focus1On ( 'accordion' ).focus2On ( 'profile' )} title={<div>Profile</div>}>
        {s => <div>{uppercaseFirstLetter ( s )}</div>}
      </AccordionExplicitList>
      <EditAttributesTable state={state.focusOn ( 'data' )} children={
        ( key, state ) => [ <div>{splitAndCapitalize ( key )}</div>, <div>{state.optJson ()}</div> ]
      }/>
      <div>Organisation data goes here: like the git repo locally and remotely</div>
      <div>Current environments database config goes here (schema/user/pass) and test config</div>
      <div>Current LDAP config goes here and test config</div>
    </div>
  )
}