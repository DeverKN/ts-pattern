/*

Excluding

*/

import { RestBind } from "../types/bind";
import { AnyArray } from "../types/helpers/AnyArray";
import { ArrayVals } from "../types/helpers/ArrayVals";

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
// type NotNever = MapNeverToDefinitelyNotNever<[never, never, any]>;
// type Test = FancyExclude<[number, number], [never, never]>;

// type ArrayType<T extends AnyArray> = T extends (infer TArr)[] ? TArr : never;

// type Test6 = FancyExclude<number[], [any, PredicateRestBind<"rest", any>]>;
// type Test7 = ArrayExcludeHelperForwards<number, [any, PredicateRestBind<"rest", any>], ["Fall"]>;

// type Test2 = [any] extends [any] ? "true" : "false";
type IsAny<T> = MaybeTrue<T extends never ? (T extends true ? true : false) : false>;
type MaybeTrue<T extends boolean> = [T] extends [false] ? false : true;

type IsTuple<T extends AnyArray> = T extends (infer ArrType)[] ? (ArrType[] extends T ? false : true) : false;
type False = IsTuple<number[]>;
//    ^? type False = false
type True = IsTuple<[number, number]>;
//    ^? type True = true

type ExcludeEmpty<T extends AnyArray, U extends AnyArray> = IsTuple<T> extends true ? Exclude<T, U> : ExcludeEmptyHelper<T, U>;

type ExcludeEmptyHelper<T extends AnyArray, U extends AnyArray> = T extends (infer TArr)[]
  ? U extends []
    ? [TArr, ...ArrayVals<T>[]]
    : U extends [infer UFirst, ...infer URest]
    ? [] | [UFirst, ...ExcludeEmptyHelper<T, URest>]
    : never
  : never;

type Test1 = ExcludeEmpty<number[], []>;
//    ^? type Test1 = [number, ...number[]]
type Test2 = ExcludeEmpty<number[], [number]>;
//    ^? type Test2 = [] | [number, number, ...number[]]
type Test3 = ExcludeEmpty<number[], [number, number]>;
//    ^? type Test3 = [] | [number] | [number, number, number, ...number[]]
type Test4 = ExcludeEmpty<[number, number], [number, number]>;
//    ^? type Test4 = never
type Test5 = ExcludeEmpty<[number, number], [number]>;
//    ^? type Test5 = [number, number]

type Test6 = FancyExclude<number[], []>;
//    ^? type Test6 = [number, ...number[]]

// type Yes = IsAny<any>
// type No1 = IsAny<never>
// type No2 = IsAny<5>
// type TestArr = ArrayType<[number, never]>
