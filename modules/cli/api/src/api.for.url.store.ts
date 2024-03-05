import { UrlLoadFn, UrlSaveFn } from "@intellimaintain/url";
import { KoaPartialFunction } from "@runbook/koa";
import { ErrorsAnd, hasErrors } from "@laoban/utils";

export function handleUrls <Res>( methodType: string, actionFn: ( url: string, requestBody: string ) => Promise<ErrorsAnd<Res>> ): KoaPartialFunction {
  return {
    isDefinedAt: ( ctx ) => {
      const match = /\/url\/([^\/]+)/.exec ( ctx.context.request.path );
      const isMethodMatch = ctx.context.request.method === methodType;
      return match && isMethodMatch;
    },
    apply: async ( ctx ) => {
      const match = /\/url\/([^\/]+)/.exec ( ctx.context.request.path );
      const url = match[ 1 ];
      try {
        console.log ( `${methodType}Urls`, url );
        // The actionFn is either 'load' for GET or 'save' for PUT
        const result: ErrorsAnd<Res> = await actionFn ( url, ctx.context.request.body )
        if ( hasErrors ( result ) ) {
          ctx.context.status = 500;
          ctx.context.body = result.join ( '\n' );
          return;
        }
        ctx.context.body = JSON.stringify ( result );
        ctx.context.set ( 'Content-Type', 'application/json' );
      } catch ( e ) {
        ctx.context.status = 404;
        ctx.context.body = e.toString ();
      }
    }
  };
}

export const getUrls = ( load: UrlLoadFn ): KoaPartialFunction => handleUrls ( 'GET', load );
export const putUrls = ( save: UrlSaveFn ): KoaPartialFunction => handleUrls ( 'PUT', save );

