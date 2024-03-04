import { GitOps, GitResult, isSuccessfulGitResult, OrganisationGitData } from "@intellimaintain/git";
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
export const shellGitsops = ( debug?: boolean ): GitOps => {
  return {
    init: async ( repo ) => {
      if ( debug ) console.log ( 'init', repo )
      await fs.promises.mkdir ( repo, { recursive: true } )
      if ( debug ) console.log ( 'made dir' )
      return executeScriptInShell ( repo, 'git init', debug );
    },
    commit: async ( repo, message: string ) => {
      let result1: GitResult = await executeScriptInShell ( repo, 'git add .', debug );
      if ( debug ) console.log ( 'add', result1 )
      let result2 = await executeScriptInShell ( repo, `git commit -m "${message}"`, debug );
      if ( debug ) console.log ( 'commit', result2 )
      return result2;
    },
    status: ( repo ) => executeScriptInShell ( repo, 'git status' ),
    hashFor: async ( repo, fileName: string ) => {
      const result = await executeScriptInShell ( repo, `git hash-object ${fileName}`, debug );
      if ( isSuccessfulGitResult ( result ) ) return result.message.trim();
      throw new Error ( `Could not get hash for ${fileName}. ${JSON.stringify ( result )}. Repo is ${repo}` )
    },
    sizeForHash: async ( repo, hash: string ): Promise<number> => {
      const result = await executeScriptInShell ( repo, `git cat-file -s ${hash}`, debug );
      if ( isSuccessfulGitResult ( result ) ) return Number.parseInt ( result.message.trim() );
      throw new Error ( `Could not get size for ${hash}. ${JSON.stringify ( result )}. Repo is ${repo}` )
    },
    fileFor: async ( repo, hash: string ) => {
      const result = await executeScriptInShell ( repo, `git cat-file -p ${hash}`, debug );
      if ( isSuccessfulGitResult ( result ) ) return result.message;
      throw new Error ( `Could not get file for ${hash}. ${JSON.stringify ( result )}. Repo is ${repo}` )
    }
  }
}
