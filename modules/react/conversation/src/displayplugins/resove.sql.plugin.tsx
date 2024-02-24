import { DisplayMessagePlugin } from "@intellimaintain/components";
import { genericSqlDisplayMessagePlugin } from "./SqlData";

export const resolveSqlDisplayMessagePlugin: DisplayMessagePlugin =
               genericSqlDisplayMessagePlugin ( {
                 beforeAfterRex: /^(.*?)\[(Resolve)Sql\](.*)$/,
                 sqlFn: sql => sql?.resolve?.sql?.toString () || ''
               } )



