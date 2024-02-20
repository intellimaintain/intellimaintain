import { defaultEventProcessor } from "@intellimaintain/events";
import { defaultIdStoreDetails, loadFromIdStore } from "@intellimaintain/idstore";

export const idStore = ( root: string ) => loadFromIdStore ( defaultIdStoreDetails ( root ) );
export const sep = ( root: string ) =>  defaultEventProcessor ( 'start.', {}, idStore ( root ) )
