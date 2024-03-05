import { findFileUp } from "@laoban/fileops";
import fs from "fs";
import { NameSpaceDetails, AllNamespaceDetails, OrganisationUrlStoreConfig } from "@intellimaintain/url";

const laobanDir = findFileUp ( process.cwd (), async f => {
  try {
    return await fs.promises.stat ( f + '/laoban.json' ).then ( stat => stat.isFile () );
  } catch ( e ) {return false}
} )
export const testDir = laobanDir.then ( d => d + '/tests/git' )

const parser = ( id: string, s: string ) => s + "_parsed";
const writer = ( s: any ) => s + "_written";
export const ns1: NameSpaceDetails = {
  pathInGitRepo: "namespace/path",
  extension: "txt",
  mimeType: "text/plain",
  parser,
  writer,
  encoding: "utf8"
};
export const allNameSpaceDetails: AllNamespaceDetails = { ns1 }
export const orgToDetails = ( baseDir: string ): OrganisationUrlStoreConfig => ({
  baseDir,
  nameSpaceDetails:allNameSpaceDetails
});