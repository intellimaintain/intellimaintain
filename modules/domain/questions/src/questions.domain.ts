import { Optional } from "@focuson/lens";
import { composePartialFunctionK, optionalNotTherePfK } from "@intellimaintain/utils";
import { ChatDisplayData, Operator, QuestionPFK } from "@intellimaintain/domain";
import { Ticket } from "@intellimaintain/tickets";


const emptyOperatorDetails: ChatDisplayData<Operator> = ({ type: 'operatorDetails' });
const emptyTicketDetails: ChatDisplayData<Ticket> = ({ type: 'ticketDetails' });

export function initialQuestions<S> ( operatorO: Optional<S, Operator>, ticketO: Optional<S, Ticket> ): QuestionPFK<S> {
  return composePartialFunctionK<S, ChatDisplayData<any>> (
    optionalNotTherePfK ( operatorO, () => emptyOperatorDetails ),
    optionalNotTherePfK ( ticketO, () => emptyTicketDetails ) )
}


