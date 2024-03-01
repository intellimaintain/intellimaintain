import { GitOpsFn, GitResult, isSuccessfulGitResult, OrganisationGitData } from "@intellimaintain/git";
import cp from "child_process";
import * as fs from "fs";


export const executeScriptInShell = ( cwd: string, cmd: string, debug?: boolean ): Promise<GitResult> => {
  if ( debug ) console.log ( 'executeScriptInShell', cwd, cmd.trim () )
  return new Promise<GitResult> ( resolve => {
    cp.exec ( cmd, { cwd, env: process.env }, ( error, stdout, stdErr ) => {
      if ( debug ) console.log ( 'exec', cmd.trim (), error, stdout, stdErr )
      if ( error === null || error.code === 0 )
        resolve ( { message: stdout.toString (), code: 0 } )
      else
        resolve ( { message: stdout.toString (), error: stdErr.toString (), code: error.code } )
    } )
  } );
};
export const shellGitsops: GitOpsFn = ( organisation: OrganisationGitData, debug?: boolean ) => {
  return {
    init: async () => {
      if ( debug ) console.log ( 'init', organisation.repoPath )
      await fs.promises.mkdir ( organisation.repoPath, { recursive: true } )
      if ( debug ) console.log ( 'made dir' )
      return executeScriptInShell ( organisation.repoPath, 'git init', debug );
    },
    commit: async ( message: string ) => {
      let result1: GitResult = await executeScriptInShell ( organisation.repoPath, 'git add .', debug );
      if ( debug ) console.log ( 'add', result1 )
      let result2 = await executeScriptInShell ( organisation.repoPath, `git commit -m "${message}"`, debug );
      if ( debug ) console.log ( 'commit', result2 )
      return result2;
    },
    status: () => executeScriptInShell ( organisation.repoPath, 'git status' ),
    hashFor: async ( fileName: string ) => {
      const result = await executeScriptInShell ( organisation.repoPath, `git hash-object ${fileName}`, debug );
      if ( isSuccessfulGitResult ( result ) ) return result.message;
      throw new Error ( `Could not get hash for ${fileName}. ${JSON.stringify ( result )}` )
    },
    fileFor: async ( hash: string ) => {
      const result = await executeScriptInShell ( organisation.repoPath, `git cat-file -p ${hash}`, debug );
      if ( isSuccessfulGitResult ( result ) ) return result.message;
      throw new Error ( `Could not get file for ${hash}. ${JSON.stringify ( result )}` )
    }
  }
}
