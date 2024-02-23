import { NameAnd } from "@laoban/utils"

export type ListIds= () =>Promise<string[]>

export type AllListIds = NameAnd<ListIds>