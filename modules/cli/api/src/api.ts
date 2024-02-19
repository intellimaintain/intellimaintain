import { ContextAndStats, defaultShowsError, KoaPartialFunction, notFoundIs404 } from "@runbook/koa";
import { chainOfResponsibility } from "@runbook/utils";
import { fileLoading, loadStringIncrementally } from "@intellimaintain/eventstore";


export const eventsPF: KoaPartialFunction = {
  isDefinedAt: ( ctx ) => ctx.stats?.isFile () && ctx.context.request.method === 'GET',
  apply: async ( ctx ) => {
    const query = ctx.context.request.query
    const start = Number.parseInt ( query.start || "0" )
    const loadFileDetails = fileLoading ( ctx.reqPathNoTrailing, start )
    const result = await loadStringIncrementally ( loadFileDetails )
    ctx.context.body = `${result.fileLoading.lastFileSize}\n${result.result}`
  }
}
export const wizardOfOzApiHandlers = ( ...handlers: KoaPartialFunction[] ): ( from: ContextAndStats, ) => Promise<void> =>
  chainOfResponsibility ( defaultShowsError, //called if no matches
    eventsPF,
    ...handlers,
    notFoundIs404,
  )