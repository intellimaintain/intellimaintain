import { findFileUp } from "@laoban/fileops";
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
      const gitOps: GitOps = await shellGitsops ()
      await gitOps.init ( repoPath ) // creates a new repo including the directory
      expect ( fs.promises.stat ( repoPath ).then ( s => s.isDirectory () ) ).resolves.toBeTruthy ()
      await fs.promises.writeFile ( repoPath + '/file.txt', 'hello' )
      await gitOps.commit ( repoPath, 'initial commit' )
      const helloHash = await gitOps.hashFor ( repoPath, 'file.txt' )
      await fs.promises.writeFile ( repoPath + '/file.txt', 'goodbye' )
      await gitOps.commit ( repoPath, 'second commit' )
      const goodbyeHash = await gitOps.hashFor ( repoPath, 'file.txt' )
      expect ( await gitOps.fileFor ( repoPath, helloHash ) ).toEqual ( 'hello' )
      expect ( await gitOps.fileFor ( repoPath, goodbyeHash ) ).toEqual ( 'goodbye' )
      expect ( await gitOps.sizeForHash ( repoPath, helloHash ) ).toEqual ( 5 )
      expect ( await gitOps.sizeForHash ( repoPath, goodbyeHash ) ).toEqual ( 7 )
    } )
  } )
} )
