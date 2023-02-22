import { ArrayVals } from "../types/helpers/ArrayVals";

export type EntryTuple<K extends PropertyKey, V> = [K, V];
type FromEntries<T extends EntryTuple<PropertyKey, unknown>[]> = {
  [Key in ArrayVals<T>[0]]: Extract<ArrayVals<T>, [Key, unknown]>[1]
}

export const fromEntries = <T extends EntryTuple<PropertyKey, unknown>[]>(entries: T): FromEntries<T> => {
  return Object.fromEntries(entries) as unknown as FromEntries<T>
}

// type Obj = FromEntries<[["string", string], ["number", number]]>