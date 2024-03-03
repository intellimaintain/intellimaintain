import { TicketType } from "@intellimaintain/domain";

export const updateValueInDatabase: TicketType = {
  name: 'UpdateValueInDatabase',
  description: 'Update a value in the database',
  phase: {
    CheckTicket: {},
    Approval: {},
    Resolve: {},
    Close: {}
  }
}