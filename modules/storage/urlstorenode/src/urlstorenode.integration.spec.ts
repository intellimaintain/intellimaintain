import fs from "fs";
import { GitOps } from "@intellimaintain/git";
import { shellGitsops } from "@intellimaintain/shell_git";
import { orThrow, parseIdentityUrl, parseNamedUrl } from "@intellimaintain/url";
import { orgToDetails, testDir } from "./integration.fixture";
import { loadFromIdentityUrl, loadFromNamedUrl, loadFromUrlStore } from "./node.urlstore.load";
import { saveNamedUrl } from "./node.urlstore.save";
import path from "path";

describe ( "loadFromNamedUrl and loadFromIdentityUrl integration test", () => {
  beforeEach ( async () =>
    fs.promises.rm ( await testDir, { recursive: true } ).catch ( e => console.log ( 'ignore error', e ) ) )

  it ( "should add a file to a new repo, commit it, change it and get both old and new values", async () => {
    const repoPath = await testDir.then ( d => d + '/org1' )
    const fileInRepoPath = 'namespace/path/file1.txt'
    const filePath = repoPath + '/' + fileInRepoPath
    const gitOps: GitOps = await shellGitsops ()
    await gitOps.init ( repoPath ) // creates a new repo including the directory
    console.log ( 'inited', filePath )
    await fs.promises.mkdir ( path.dirname(filePath), { recursive: true } )
    console.log('making file', filePath)//making file C:/git/IntelliMaintain/tests/git/org1/namespace/path/file1.txt
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
      "fileSize": 7,
      "mimeType": "text/plain",
      "id": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
    } )
    const loaded2 = orThrow ( await loadFromIdentityUrl ( gitOps, config ) ( parseIdentityUrl ( loaded1.id ) ) )
    expect ( loaded2 ).toEqual ( {
      "url": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
      "result": "goodbye_parsed",
      "fileSize": 7,
      "mimeType": "text/plain",
      "id": "itsmid:org1:ns1:a21e91b14c870770cf612020a0619a90d987df4c",
    } )
    const loaded3 = orThrow ( await loadFromIdentityUrl ( gitOps, config ) ( parseIdentityUrl ( "itsmid:org1:ns1:" + helloHash ) ) )
    expect ( loaded3 ).toEqual ( {
      "fileSize": 5,
      "id": "itsmid:org1:ns1:b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0",
      "mimeType": "text/plain",
      "result": "hello_parsed",
      "url": "itsmid:org1:ns1:b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0"
    } )
  } )
} )

describe ( "saveNamedUrl", () => {
  beforeEach ( async () =>
    fs.promises.rm ( await testDir, { recursive: true } ).catch ( e => console.log ( 'ignore error', e ) ) )

  it ( "should create files and commit them", async () => {
    const repoPath = await testDir.then ( d => d + '/org1Repo' )
    const fileInRepoPath = 'ns1/file1.txt'
    const filePath = repoPath + '/' + fileInRepoPath
    const gitOps: GitOps = await shellGitsops ()

    console.log ( 'inited', filePath )

    const save = saveNamedUrl ( gitOps, orgToDetails ( await testDir ) )
    const load = loadFromUrlStore ( gitOps, orgToDetails ( await testDir ) )

    const result1 = await save ( "itsm:org1:ns1:file1", "hello" )
    expect ( result1 ).toEqual ( {
      "fileSize": 13,
      "id": "itsmid:org1:ns1:875376a87df56c0d460b4039e470c3f269f32257",
      "url": "itsm:org1:ns1:file1"
    } )
    const result2 = await save ( "itsm:org1:ns1:file1", "goodbye" )
    expect ( result2 ).toEqual ( {
      "fileSize": 15,
      "id": "itsmid:org1:ns1:919a09a06a17d2471fbe31a3a0c1f16f88f13a15",
      "url": "itsm:org1:ns1:file1"
    } )
    console.log ( 'getting goodbye1' )

    const goodbye1 = await load ( "itsm:org1:ns1:file1" )
    expect ( goodbye1 ).toEqual ( {
      "fileSize": 15,
      "id": "itsmid:org1:ns1:919a09a06a17d2471fbe31a3a0c1f16f88f13a15",
      "mimeType": "text/plain",
      "result": "goodbye_written_parsed",
      "url": "itsm:org1:ns1:file1"
    } )

    console.log ( 'getting goodbye2' )
    const goodbye2 = await load ( "itsmid:org1:ns1:875376a87df56c0d460b4039e470c3f269f32257" )
    expect ( goodbye2 ).toEqual ({
      "fileSize": 13,
      "id": "itsmid:org1:ns1:875376a87df56c0d460b4039e470c3f269f32257",
      "mimeType": "text/plain",
      "result": "hello_written_parsed",
      "url": "itsmid:org1:ns1:875376a87df56c0d460b4039e470c3f269f32257"
    } )
    const loadedHello = await load ( "itsmid:org1:ns1:919a09a06a17d2471fbe31a3a0c1f16f88f13a15" )
    expect ( loadedHello ).toEqual ({
      "fileSize": 15,
      "id": "itsmid:org1:ns1:919a09a06a17d2471fbe31a3a0c1f16f88f13a15",
      "mimeType": "text/plain",
      "result": "goodbye_written_parsed",
      "url": "itsmid:org1:ns1:919a09a06a17d2471fbe31a3a0c1f16f88f13a15"
    } )
  } )
} )