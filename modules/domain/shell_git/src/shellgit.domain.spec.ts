import { findFileUp } from "@laoban/fileops";
import { Simulate } from "react-dom/test-utils";
import beforeInput = Simulate.beforeInput;
import * as fs from "fs";
import { shellGitsops } from "./shellgit.domain";
import { GitOps } from "@intellimaintain/git";


const laobanDir = findFileUp ( process.cwd (), async f => {
  // console.log ( 'checking', f )
  try {
    return await fs.promises.stat ( f + '/laoban.json' ).then ( stat => stat.isFile () );
  } catch ( e ) {return false}
} )
const testDir = laobanDir.then ( d => d + '/tests/git' )

describe ( "git", () => {
  describe ( "happy path", () => {
    beforeEach ( async () =>
      fs.promises.rm ( await testDir, { recursive: true } ).catch ( e => console.log ( 'ignore error', e ) ) )

    it ( "should add a file to a new repo, commit it, change it and get both old and new values", async () => {
      const repoPath = await testDir.then ( d => d + '/org' )
      const gitOps: GitOps = await shellGitsops ( { repoPath } )
      await gitOps.init () // creates a new repo including the directory
      expect ( fs.promises.stat ( repoPath ).then ( s => s.isDirectory () ) ).resolves.toBeTruthy ()
      await fs.promises.writeFile ( repoPath + '/file.txt', 'hello' )
      await gitOps.commit ( 'initial commit' )
      const helloHash = await gitOps.hashFor ( 'file.txt' )
      await fs.promises.writeFile ( repoPath + '/file.txt', 'goodbye' )
      await gitOps.commit ( 'second commit' )
      const goodbyeHash = await gitOps.hashFor ( 'file.txt' )
      expect ( await gitOps.fileFor ( helloHash ) ).toEqual ( 'hello' )
      expect ( await gitOps.fileFor ( goodbyeHash ) ).toEqual ( 'goodbye' )
    } )
  } )
} )
