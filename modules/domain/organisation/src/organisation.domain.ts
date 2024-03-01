export interface Organisation {
  name: string
  /** The root of the git workspace for this organisation. Defaults to 'config/${name}' */
  gitRepo?: string
}

export function gitRepoFor ( configDir: string, org: Organisation ): string {
  return org.gitRepo || `${configDir}/${org.name}`
}