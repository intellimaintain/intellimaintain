import { NameAnd } from "@laoban/utils";
import { JSONPrimitive } from "@intellimaintain/utils";

export type EventContext = NameAnd<JSONPrimitive> //meta data about the event. Like source/line number/ etc.

export type EventType = 'zero' | 'setId' | 'setValue' | 'append'

export interface BaseEvent {
  context: EventContext
  event: EventType
}
export interface ZeroEvent extends BaseEvent {
  event: 'zero'
}
export function isZeroEvent ( e: BaseEvent ): e is ZeroEvent {
  return e.event === 'zero'
}
export interface LensPathEvent extends BaseEvent {
  path: string
}
export function isLensPathEvent ( e: BaseEvent ): e is LensPathEvent {
  return 'path' in e
}

/** Given an id this will go get the data at the id (parsed by the parser) and set it as the value at the place given by the path
 * So the id is just a string which is passed to the id store. It can be anything. A url. Structured... anything
 * Typically it will have a namespace and a value
 *
 * The parser is just the name of the parser we will use to parse the data. It is passed to the parser store to get the parser
 * */
export interface SetIdEvent extends LensPathEvent {
  event: 'setId'
  id: string
  parser: string
}
export function isSetIdEvent ( e: BaseEvent ): e is SetIdEvent {
  return e.event === 'setId'
}

/** Set the value at the path */
export interface SetValueEvent extends LensPathEvent {
  event: 'setValue'
  value: any
}
export function isSetValueEvent ( e: BaseEvent ): e is SetValueEvent {
  return e.event === 'setValue'
}

export interface AppendEvent extends LensPathEvent {
  event: 'append'
  value: any
}

export type Event = SetIdEvent | SetValueEvent | ZeroEvent | AppendEvent
export interface EventNameAnd<T> {
  zero: T
  setId: T
  setValue: T
  append: T
}