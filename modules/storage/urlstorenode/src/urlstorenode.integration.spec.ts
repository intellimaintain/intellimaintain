import fs from "fs";
import { GitOps } from "@intellimaintain/git";
import { shellGitsops } from "@intellimaintain/shell_git";
import { findFileUp } from "@laoban/fileops";
import { loadFromIdentityUrl, loadFromNamedUrl, OrganisationToNameSpaceToDetails } from "./urlstorenode";
import { orThrow, parseIdentityUrl, parseNamedUrl } from "@intellimaintain/url";
import { orgToDetails, testDir } from "./integration.fixture";

describe ( "namedUrlToResult", () => {
  beforeEach ( async () =>
    fs.promises.rm ( await testDir, { recursive: true } ).catch ( e => console.log ( 'ignore error', e ) ) )

  it ( "should add a file to a new repo, commit it, change it and get both old and new values", async () => {
    const repoPath = await testDir.then ( d => d + '/org1Repo' )
    const fileInRepoPath = 'ns1/file1.txt'
    const filePath = repoPath + '/' + fileInRepoPath
    const gitOps: GitOps = await shellGitsops ()
    await gitOps.init ( repoPath ) // creates a new repo including the directory
    console.log ( 'inited', filePath )
    await fs.promises.mkdir ( repoPath + '/ns1', { recursive: true } )
    await fs.promises.writeFile ( filePath, 'hello' )
    await gitOps.commit ( repoPath, 'initial commit' )
    console.log ( 'commit' )
    const helloHash = await gitOps.hashFor ( repoPath, fileInRepoPath )
    console.log ( 'helloHash', helloHash )
    await fs.promises.writeFile ( filePath, 'goodbye' )
    await gitOps.commit ( repoPath, 'second commit' )
    console.log ( 'commit2' )
    const goodbyeHash = await gitOps.hashFor ( repoPath, fileInRepoPath )
    console.log ( 'goodbyeHash', goodbyeHash )

    //---
    const config = orgToDetails ( await testDir )
    console.log ( 'config', config )
    const loaded1 = orThrow ( await loadFromNamedUrl ( gitOps, config ) ( parseNamedUrl ( "itsm:org1:ns1:file1" ) ) )
    expect ( loaded1 ).toEqual ( {
      "url": "itsm:org1:ns1:file1",
      "result": "goodbye_parsed",
      "count": 7,
      "mimeType": "text/plain",
      "id": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
    } )
    const loaded2 = orThrow ( await loadFromIdentityUrl ( gitOps, config ) ( parseIdentityUrl ( loaded1.id ) ) )
    expect ( loaded2 ).toEqual ( {
      "url": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
      "result": "goodbye_parsed",
      "count": 7,
      "mimeType": "text/plain",
      "id": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
    } )
    const loaded3 = orThrow ( await loadFromIdentityUrl ( gitOps, config ) ( parseIdentityUrl ( "itsmid:org1:ns1:" + helloHash ) ) )
    expect ( loaded3 ).toEqual ( {
      "count": 5,
      "id": "itsmid:org1:ns1:b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0",
      "mimeType": "text/plain",
      "result": "hello_parsed",
      "url": "itsmid:org1:ns1:b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0"
    } )
  } )
} )
