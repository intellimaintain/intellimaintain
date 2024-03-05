import { ErrorsAnd } from "@laoban/utils";

export type YamlWriter = ( content: any ) => ErrorsAnd<string>
export type YamlParser = (s: string) => ErrorsAnd<any>

export type YamlCapability = {
  parser: YamlParser
  writer: YamlWriter
}