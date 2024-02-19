import { NameAnd } from "@laoban/utils";
import { ErrorEvent, Event, isAppendEvent, isSetIdEvent, isSetValueEvent, isZeroEvent } from "@intellimaintain/events";
import { JSONPrimitive } from "@intellimaintain/utils";


export const parseEvent = ( extraContext: NameAnd<JSONPrimitive> ) => ( s: string ): Event => {

  try {
    let event = JSON.parse ( s );
    function makeError ( s: string ): ErrorEvent { return { event: 'error', context: extraContext, error: s, from: event }}

    if ( typeof event !== 'object' ) return makeError ( `Event is not an object` )
    if ( !('context' in event) ) return makeError ( `No context in event ` )
    if ( typeof event.context !== 'object' ) return makeError ( `Event context is not an object` )
    event.context = { ...extraContext, ...event.context }
    if ( isZeroEvent ( event ) ) return event
    if ( !('path' in event) ) return makeError ( `No path in event ` )
    if ( isSetIdEvent ( event ) ) return ('id' in event) ? event : makeError ( `No id` );
    if ( isSetValueEvent ( event ) ) return ('value' in event) ? event : makeError ( `No value` );
    if ( isAppendEvent ( event ) ) return ('value' in event) ? event : makeError ( `No value ` );
    return makeError ( `Unknown event type` )
  } catch ( e ) { return { event: 'error', context: extraContext, error: e.message, from: s } }
};


export  function stringToEvents ( extraContext: NameAnd<JSONPrimitive>, s: string ): Event [] {
  const lines = s.split ( '\n' ).map ( s => s.trim () ).filter ( s => s.length > 0 )
  const result = lines.map ( parseEvent ( extraContext ) )
  return result
}
