import { nameSpaceDetails } from "@intellimaintain/url";


const kaNs = nameSpaceDetails( 'ka', { parser: ( id: string, s: string ) => {}, writer: ( s: string ) => s + "_written" } );