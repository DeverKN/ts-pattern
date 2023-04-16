import { AnyArray } from "../types/helpers/AnyArray";
import { AnyObject } from "../types/helpers/AnyObject";

export const t = <const T extends readonly number[]>(t: T): [...T] => t as [...T];

export type UnReadOnly<T> = T extends AnyArray ? UnReadOnlyArray<T> : T extends AnyObject ? UnReadOnlyObject<T> : T;
type UnReadOnlyArray<T extends AnyArray> = UnReadOnlyArrayDeep<[...T]>
type UnReadOnlyArrayDeep<TArray extends AnyArray> = TArray extends []
  ? []
  : TArray extends [infer First, ...infer Rest extends AnyArray]
  ? [UnReadOnly<First>, ...UnReadOnlyArrayDeep<Rest>]
  : [];
type UnReadOnlyObject<TObject extends AnyObject, K extends PropertyKey = keyof TObject> = {
  [key in K]: UnReadOnly<TObject[key]>;
};

export const c = <const T>(t: T): UnReadOnly<T> => t as UnReadOnly<T>;
