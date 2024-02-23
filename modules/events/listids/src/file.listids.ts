import { AllIdStoreDetails } from "@intellimaintain/idstore";
import { ListIds } from "./listids";
import * as fs from "fs";

function removeFileExtension ( filename: string ): string {
  const lastDotIndex = filename.lastIndexOf ( '.' );
  return lastDotIndex <= 0 ? filename : filename.substring ( 0, lastDotIndex );
}

export function findListIds ( allIdStoreDetails: AllIdStoreDetails ): ListIds {
  return async type => {
    const details = allIdStoreDetails.details[ type ];
    if ( details === undefined ) throw Error ( `No id store for ${type}` );
    const files = await fs.promises.readdir ( details.rootPath, { withFileTypes: true } );
    let ids: string[] = files.filter ( f => f.isFile () && f.name.endsWith ( '.' + details.extension ) ).map ( f => `${type}:${removeFileExtension ( f.name )}` );
    return ids;
  }
}