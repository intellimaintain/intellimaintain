import { deepCombineTwoObjects, NameAnd } from "@laoban/utils";

export interface DatabaseConfig {
  type?: string
  user?: string
  schema?: string
  password?: string
}

export interface DatabaseAndEnvironments {
  database?: DatabaseConfig
  environments?: NameAnd<DatabaseConfig>
}

export function database(d: DatabaseAndEnvironments, env: string): DatabaseConfig {
  return deepCombineTwoObjects(d.database, d.environments[env])
}
