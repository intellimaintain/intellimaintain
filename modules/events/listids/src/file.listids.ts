import { AllIdStoreDetails } from "@intellimaintain/idstore";
import { AllListIds } from "./listids";
import { mapObject } from "@laoban/utils";
import * as fs from "fs";

function removeFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex <= 0 ? filename : filename.substring(0, lastDotIndex);
}

export function findListIds ( allIdStoreDetails: AllIdStoreDetails ): AllListIds {
  return mapObject ( allIdStoreDetails.details, ( d, name ) =>
    async () => {
      const files = await fs.promises.readdir ( d.rootPath, { withFileTypes: true } );
      let ids: string[] = files.filter ( f => f.isFile () && f.name.endsWith ( '.' + d.extension ) ).map ( f => `${name}:${removeFileExtension(f.name)}` );
      return ids;
    }
  )
}