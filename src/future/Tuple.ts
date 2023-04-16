import { AnyArray } from "../types/helpers/AnyArray";
import { AnyObject } from "../types/helpers/AnyObject";
import { type Tuple } from "../types/helpers/literal";
// export const c = <const T>(args: T) => args
// export const tuple = <const TArgs extends Tuple>(...args: TArgs) => args
// const t = tuple

// const test = t(1, t(3, 4))

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

const test = t([1, 2]);

const test2 = c({ c: {b: 1} });

const test3 = c([1, [1, 2, [4, 5]]]);

// type Writeable<T extends AnyObject, K extends PropertyKey = keyof T> = {
//   [P in K]: T[P];
// };

test2.c.b = 1
// type Test = UnReadOnlyObject<Readonly<{c: 5}>>
// type HasNames = { readonly names: string[] };
// function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
//     return arg.names;
// }

// // Inferred type: string[]
// const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});
