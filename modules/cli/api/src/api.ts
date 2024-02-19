import { ContextAndStats, defaultShowsError, KoaPartialFunction, notFoundIs404 } from "@runbook/koa";
import { chainOfResponsibility } from "@runbook/utils";
import { fileLoading, loadStringIncrementally } from "@intellimaintain/fileeventstore";



export const eventsPF: KoaPartialFunction = {
  isDefinedAt: ( ctx ) => ctx.stats?.isFile () && ctx.context.request.method === 'GET',
  apply: async ( ctx ) => {
    const query = ctx.context.request.query
    const start = Number.parseInt ( query.start || "0" )
    const result = await loadStringIncrementally ( fileLoading ( ctx.reqPathNoTrailing ) )(start)
    ctx.context.body = `${result.newStart}\n${result.result}`
  }
}
export const eventsCorsPF: KoaPartialFunction = {
  isDefinedAt: ( ctx ) =>  ctx.context.request.method === 'HEAD',
  apply: async ( ctx ) => {
    const query = ctx.context.request.query
    const start = Number.parseInt ( query.start || "0" )
    const result = await loadStringIncrementally ( fileLoading ( ctx.reqPathNoTrailing ) )(start)
    ctx.context.response.
    ctx.context.body = ''
  }
}
//  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
export const wizardOfOzApiHandlers = ( ...handlers: KoaPartialFunction[] ): ( from: ContextAndStats, ) => Promise<void> =>
  chainOfResponsibility ( defaultShowsError, //called if no matches
    eventsPF,
    ...handlers,
    notFoundIs404,
  )