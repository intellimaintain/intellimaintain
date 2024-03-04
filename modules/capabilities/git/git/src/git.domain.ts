import { OrganisationGitData } from "./git.config";

export interface SuccessfulGitResult {
  message: string
  code: 0
}
export function isSuccessfulGitResult ( t: GitResult ): t is SuccessfulGitResult {
  return t.code === 0
}
export interface FailedGitResult {
  message?: string
  error: string
  code: number
}
export type GitResult = SuccessfulGitResult | FailedGitResult

export interface GitOps {
  init: ( repo: string ) => Promise<GitResult>
  commit: ( repo: string, message: string ) => Promise<GitResult>
  hashFor: ( repo: string, fileName: string ) => Promise<string>
  sizeForHash: ( repo: string, hash: string ) => Promise<number>
  fileFor: ( repo: string, hash: string ) => Promise<string>
  status: ( repo: string ) => Promise<GitResult>
}
