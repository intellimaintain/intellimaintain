import { TicketType } from "@intellimaintain/ticket_type";

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