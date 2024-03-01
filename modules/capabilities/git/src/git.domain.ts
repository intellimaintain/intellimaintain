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

export type GitOpsFn = ( organisation: OrganisationGitData , debug?: boolean) => GitOps
export interface GitOps {
  init: () => Promise<GitResult>
  commit: ( message: string ) => Promise<GitResult>
  hashFor: ( fileName: string ) => Promise<string>
  fileFor: ( hash: string ) => Promise<string>
  status: () => Promise<GitResult>
}
