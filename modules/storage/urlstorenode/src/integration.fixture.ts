import { findFileUp } from "@laoban/fileops";
import fs from "fs";
import { NameSpaceDetails, OrganisationStoreDetails, OrganisationToNameSpaceToDetails } from "@intellimaintain/url";

const laobanDir = findFileUp ( process.cwd (), async f => {
  // console.log ( 'checking', f )
  try {
    return await fs.promises.stat ( f + '/laoban.json' ).then ( stat => stat.isFile () );
  } catch ( e ) {return false}
} )
export const testDir = laobanDir.then ( d => d + '/tests/git' )

const parser = ( id: string, s: string ) => s + "_parsed";
const writer = ( s: any ) => s + "_written";
export const ns1: NameSpaceDetails = {
  pathInGitRepo: "file1",
  extension: "txt",
  mimeType: "text/plain",
  parser,
  writer,
  encoding: "utf8"
};
export const org1: OrganisationStoreDetails = {
  gitRepoPath: "org1Repo",
  nameSpaceToDetails: { ns1 }
};
export const orgToDetails = ( baseDir: string ): OrganisationToNameSpaceToDetails => ({
  baseDir,
  orgToDetails: { org1 }
});