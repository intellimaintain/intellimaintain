import { ContextAndStats, defaultShowsError, KoaPartialFunction, notFoundIs404 } from "@runbook/koa";
import { chainOfResponsibility } from "@runbook/utils";
import { fileLoading, fileLocking, loadStringIncrementally, withFileLock } from "@intellimaintain/fileeventstore";

import { promises as fs } from 'fs';
import { IdStore, IdStoreResult, isBadIdStoreResult } from "@intellimaintain/idstore";



export const ids = ( idstore: IdStore ): KoaPartialFunction => ({
  isDefinedAt: ( ctx ) => ctx.context.request.path.startsWith ( '/id/' ) && ctx.context.request.method === 'GET',
  apply: async ( ctx ) => {
    console.log ( 'found ids', ctx.context.path )
    const id = ctx.context.path.slice ( 4 )
    const result: IdStoreResult = await idstore ( id )
    if ( isBadIdStoreResult(result) ) {
      ctx.context.status = 500
      ctx.context.body = result.error
    }
    else{
      ctx.context.status = 200
      ctx.context.body = result.result
      ctx.context.type = result.mimeType
    }
  }
})

export const eventsPF: KoaPartialFunction = {
  isDefinedAt: ( ctx ) => ctx.stats?.isFile () && ctx.context.request.method === 'GET',
  apply: async ( ctx ) => {
    const query = ctx.context.request.query
    const start = Number.parseInt ( query.start || "0" )
    const result = await loadStringIncrementally ( fileLoading ( ctx.reqPathNoTrailing ) ) ( start )
    ctx.context.body = `${result.newStart}\n${result.result}`
  }
}

export const appendPostPF: KoaPartialFunction = {
  isDefinedAt: ( ctx ) => ctx.stats?.isFile () && ctx.context.request.method === 'POST',
  apply: async ( ctx ) => {
    const body: any = await ctx.context.request.body // should be parsed according to content type
    if ( typeof body !== 'object' ) throw new Error ( `Expected object, got ${typeof body}. Body is ${JSON.stringify ( body )}` )
    const str = `${JSON.stringify ( body )}\n` // one line is important

    await withFileLock ( fileLocking ( ctx.reqPathNoTrailing ), async () => {
        try {
          await fs.appendFile ( ctx.reqPathNoTrailing, str );
          ctx.context.status = 200;
          ctx.context.body = 'JSON appended to file successfully';
        } catch ( error ) {
          console.error ( 'Error appending to file:', error );
          ctx.context.status = 500;
          ctx.context.body = 'Internal Server Error';
        }
      }
    )
  }
}

export const wizardOfOzApiHandlers = (idStore: IdStore, ...handlers: KoaPartialFunction[] ): ( from: ContextAndStats ) => Promise<void> =>
  chainOfResponsibility ( defaultShowsError, //called if no matches
    ids(idStore),
    eventsPF,
    appendPostPF,
    ...handlers,
    notFoundIs404,
  )