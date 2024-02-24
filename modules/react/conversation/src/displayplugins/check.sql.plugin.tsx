import { DisplayMessagePlugin } from "@intellimaintain/components";
import { genericSqlDisplayMessagePlugin } from "./SqlData";

export const checkSqlDisplayMessagePlugin: DisplayMessagePlugin =
               genericSqlDisplayMessagePlugin ( {
                 beforeAfterRex: /^(.*?)\[(Check)Sql\](.*)$/,
                 sqlFn: sql => sql?.check?.sql?.toString () || ''
               } )




