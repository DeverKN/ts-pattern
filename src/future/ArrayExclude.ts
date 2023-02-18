/*

Excluding

*/

import { PredicateRestBind, RestBind } from "../types/bind";
import { AnyArray } from "../types/helpers/AnyArray";

const SymbolForNotNever: unique symbol = Symbol("NotNever");
type DefinitelyNotNever = {
  [SymbolForNotNever]: false;
};

type ArrayExcludeHelperForwards<TArr, U extends AnyArray, TFallback extends AnyArray> = U extends [RestBind<string, TArr>]
  ? []
  : U extends [infer First, RestBind<string, TArr>]
  ? IsAny<First> extends true
    ? []
    : First extends TArr
    ? []
    : TFallback
  : U extends [infer First, ...infer Rest]
  ? IsAny<First> extends true
    ? [First, ...ArrayExcludeHelper<TArr, Rest, TFallback>]
    : First extends TArr
    ? [First, ...ArrayExcludeHelper<TArr, Rest, TFallback>]
    : TFallback
  : never;

type ArrayExcludeHelperReverse<TArr, U extends AnyArray, TFallback extends AnyArray> = U extends [RestBind<string, TArr>]
  ? []
  : U extends [RestBind<string, TArr>, infer Last]
  ? IsAny<Last> extends true
    ? []
    : Last extends TArr
    ? []
    : TFallback
  : U extends [...infer Rest, infer Last]
  ? IsAny<Last> extends true
    ? [...ArrayExcludeHelper<TArr, Rest, TFallback>, Last]
    : Last extends TArr
    ? [...ArrayExcludeHelper<TArr, Rest, TFallback>, Last]
    : TFallback
  : never;

type MapNeverToDefinitelyNotNever<T extends AnyArray> = T extends [infer First, ...infer Rest]
  ? [First] extends [never]
    ? [DefinitelyNotNever, ...MapNeverToDefinitelyNotNever<Rest>]
    : [First, ...MapNeverToDefinitelyNotNever<Rest>]
  : [];

// type IsExtact<TArr, U extends AnyArray> = U extends (infer UArr)[]
//   ? UArr extends TArr | RestBind<string, TArr>
//     ? true
//     : false
//   : false;

type ArrayExcludeHelper<TArr, U extends AnyArray, TFallback extends AnyArray> = U extends [
  infer First extends RestBind<string, TArr>,
  ...unknown[]
]
  ? IsAny<First> extends true
    ? ArrayExcludeHelperForwards<TArr, U, TFallback>
    : ArrayExcludeHelperReverse<TArr, U, TFallback>
  : ArrayExcludeHelperForwards<TArr, U, TFallback>;

type HasRestBindHelper<T> = T extends [infer First, ...infer Rest]
  ? First extends RestBind<string, unknown>
    ? true
    : HasRestBind<Rest>
  : false;

type NeverToFalse<T> = [T] extends [never] ? false : T;

type HasRestBind<T> = NeverToFalse<HasRestBindHelper<T>>;

type ArrayExclude<T extends AnyArray, U extends AnyArray> = HasRestBind<U> extends true
  ? T extends (infer TArr)[]
    ? ArrayExcludeHelper<TArr, MapNeverToDefinitelyNotNever<U>, Exclude<T, U>>
    : never
  : Exclude<T, U>;

export type FancyExclude<T, U> = T extends AnyArray ? (U extends AnyArray ? ArrayExclude<T, U> : Exclude<T, U>) : Exclude<T, U>;

// type Excluded = ArrayExclude<number[], [number, any]>;

// type Test = HasRestBind<[number, RestBind<string, number>]>;
// type Test1 = HasRestBind<[never, never]>
type NotNever = MapNeverToDefinitelyNotNever<[never, never, any]>;
type Test = FancyExclude<[number, number], [never, never]>;

type ArrayType<T extends AnyArray> = T extends (infer TArr)[] ? TArr : never;

type Test6 = FancyExclude<number[], [any, PredicateRestBind<"rest", any>]>;
type Test7 = ArrayExcludeHelperForwards<number, [any, PredicateRestBind<"rest", any>], ["Fall"]>;

// type Test2 = [any] extends [any] ? "true" : "false";
type IsAny<T> = MaybeTrue<T extends never ? (T extends true ? true : false) : false>;
type MaybeTrue<T extends boolean> = [T] extends [false] ? false : true;

// type Yes = IsAny<any>
// type No1 = IsAny<never>
// type No2 = IsAny<5>
// type TestArr = ArrayType<[number, never]>
