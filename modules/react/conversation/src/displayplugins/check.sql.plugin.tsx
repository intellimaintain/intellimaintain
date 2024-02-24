import { DisplayMessagePlugin } from "@intellimaintain/components";
import { genericSqlDisplayMessagePlugin } from "./SqlData";

export const checkSqlDisplayMessagePlugin: DisplayMessagePlugin =
               genericSqlDisplayMessagePlugin ( {
                 beforeAfterRex: /^(.*?)\[(.*)Sql\](.*)$/,
                 sqlFn: sql => sql?.check?.sql?.toString () || ''
               } )




