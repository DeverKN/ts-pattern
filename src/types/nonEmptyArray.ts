import { _ } from "../code/binds";
import { PredicateBind, PredicateRestBind, RestBind } from "./bind";
import { Extends, ExtendsAll } from "./helpers/extends";
import { FallthroughMatches } from "./matcher";
// import { ObjectRestSymbol, PartialObjectPattern } from "./pattern";
import { ResolveNonLiteralToNever } from "./resolve";

export type EmptyArray = [];
export type NonEmptyArray<T> = [T, RestBind<string, T>];
type ArrayVals<T extends unknown[]> = T[number];

export type FancyExcludeArray<T extends unknown[], U extends unknown[]> = FancyExcludeArrayHelper<T, T, U>;
type FancyExcludeArrayHelper<TBase extends unknown[], T extends unknown[], U extends unknown[]> = T extends []
  ? never
  : T extends [infer TFirst, ...infer TRest]
  ? U extends [infer UFirst, ...infer URest]
    ? RestBind<string, TFirst | ArrayVals<TRest>> extends UFirst
      ? EmptyArray
      : TFirst extends UFirst
      ? FancyExcludeArrayHelper<TBase, TRest, URest>
      : TBase
    : TBase
  : T extends (infer TArr)[]
  ? U extends [infer UFirst, ...infer URest]
    ? UFirst extends RestBind<string, TArr>
      ? EmptyArray
      : ExtendsAll<TArr, UFirst> extends true
      ? FancyExcludeArrayHelper<TBase, T, URest>
      : TBase
    : TBase
  : TBase;

type IsRestBindHelper<MaybeRestBind, T> = MaybeRestBind extends RestBind<string, T>
  ? MaybeRestBind extends never
    ? false
    : true
  : false;

// type TestRest = IsRestBindHelper<number, number>

type IsRestBind<MaybeRestBind, T> = [IsRestBindHelper<MaybeRestBind, T>] extends [never]
  ? false
  : IsRestBindHelper<MaybeRestBind, T>;

type FancyExcludeArrayV2HelperFirst<
  TFallback extends unknown[],
  T extends unknown[],
  U extends unknown[]
> = T extends (infer TArr)[]
  ? U extends [infer UFirst, ...infer URest]
    ? IsRestBind<UFirst, TArr> extends true
      ? MaybeTrue<Extends<UFirst, never>> extends true
        ? [TArr, ...FancyExcludeArrayV2Helper<TFallback, T, URest>]
        : []
      : TArr extends UFirst
      ? [TArr, ...FancyExcludeArrayV2Helper<TFallback, T, URest>]
      : [never, ...TFallback]
    : [never, ...TFallback]
  : [never, ...TFallback];

type FancyExcludeArrayV2Helper<
  TFallback extends unknown[],
  T extends unknown[],
  U extends unknown[]
> = T extends (infer TArr)[]
  ? U extends [infer UFirst, ...infer URest]
    ? IsRestBind<UFirst, TArr> extends true
      ? MaybeTrue<Extends<UFirst, never>> extends true
        ? [TArr, ...FancyExcludeArrayV2Helper<TFallback, T, URest>]
        : []
      : TArr extends UFirst
      ? [TArr, ...FancyExcludeArrayV2Helper<TFallback, T, URest>]
      : TFallback
    : TFallback
  : TFallback;

type HasRestBindHelper<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? First extends RestBind<string, any>
    ? First extends never
      ? HasRestBind<Rest>
      : true
    : HasRestBind<Rest>
  : false;

type HasRestBind<T extends unknown[]> = ForceTrue<HasRestBindHelper<T>>;
type ForceTrue<T extends boolean> = [T] extends [true] ? true : false;
type MaybeTrue<T extends boolean> = [T] extends [false] ? false : true;

// type Tested = Extends<never, 5>
// type Forced = ForceTrue<boolean>;

// type Resolved4 = ResolveNonLiteralToNever<[number, PredicateRestBind<"rest", any>]>;
// type Test2 = FancyExcludeV2<number[], Resolved4>;

// type ExtendTest = Extends<any, never>;

type FancyExcludeArrayV2<T extends unknown[], U extends unknown[]> = T extends (infer TArr)[]
  ? U extends [RestBind<string, TArr>]
    ? never
    : HasRestBind<U> extends true
    ? Shift<FancyExcludeArrayV2HelperFirst<Exclude<T, U>, T, U>>
    : Exclude<T, U>
  : Exclude<T, U>;

type FancyExcludeArrayV2ReverseHelperFirst<
  TFallback extends unknown[],
  T extends unknown[],
  U extends unknown[]
> = T extends (infer TArr)[]
  ? U extends [...infer URest, infer ULast]
    ? IsRestBind<ULast, TArr> extends true
      ? MaybeTrue<Extends<ULast, never>> extends true
        ? [...FancyExcludeArrayV2ReverseHelper<TFallback, T, URest>, TArr]
        : []
      : TArr extends ULast
      ? [...FancyExcludeArrayV2ReverseHelper<TFallback, T, URest>, TArr]
      : [never, ...TFallback]
    : [never, ...TFallback]
  : [never, ...TFallback];

type FancyExcludeArrayV2ReverseHelper<
  TFallback extends unknown[],
  T extends unknown[],
  U extends unknown[]
> = T extends (infer TArr)[]
  ? U extends [...infer URest, infer ULast]
    ? IsRestBind<ULast, TArr> extends true
      ? MaybeTrue<Extends<ULast, never>> extends true
        ? [...FancyExcludeArrayV2ReverseHelper<TFallback, T, URest>, TArr]
        : []
      : TArr extends ULast
      ? [...FancyExcludeArrayV2ReverseHelper<TFallback, T, URest>, TArr]
      : TFallback
    : TFallback
  : TFallback;

type ReverseExcluded = FancyExcludeArrayV2ReverseHelperFirst<["fail"], number[], [RestBind<string, number>, number]>;
// type TestRest = IsRestBind<number, number>

type FancyExcludeArrayV2Reverse<T extends unknown[], U extends unknown[]> = T extends (infer TArr)[]
  ? U extends [RestBind<string, TArr>]
    ? never
    : HasRestBind<U> extends true
    ? Shift<FancyExcludeArrayV2ReverseHelperFirst<Exclude<T, U>, T, U>>
    : Exclude<T, U>
  : Exclude<T, U>;

export type FancyExcludeV2<T, U> = T extends unknown[]
  ? U extends unknown[]
    ? U extends [infer FirstRest extends RestBind<string, unknown>, ...unknown[]]
      ? [FirstRest] extends [never]
        ? FancyExcludeArrayV2<T, U>
        : FancyExcludeArrayV2Reverse<T, U>
      : FancyExcludeArrayV2<T, U>
    : Exclude<T, U>
  : Exclude<T, U>;

// const pattern = [_("first"), _("rest").s] as [PredicateBind<"first", any>, PredicateRestBind<"rest", any>];
// type Resolved = ResolveNonLiteralToNever<typeof pattern>;
// type Test5 = FancyExcludeV2<number[], Resolved>;

// type Excluded = FancyExcludeArray<number[], [any, PredicateRestBind<string, any>]>;
// type Excluded2 = FancyExcludeArrayV2<number[], [any, RestBind<string, any>]>;
// type Excluded3 = FancyExcludeArrayV2<number[], [any, PredicateRestBind<string, any>]>;
// type Excluded4 = FallthroughMatches<[number, number], [number, number]>;
// type Excluded5 = FallthroughMatches<number[], [PredicateRestBind<"rest", any>, number]>;
// type Excluded6 = FancyExcludeArrayV2<number[], [never, PredicateRestBind<"rest", any>]>;
// type Resolved2 = ResolveNonLiteralToNever<[number, PredicateRestBind<"rest", any>]>
// type Excluded7 = FancyExcludeV2<number[], [never, PredicateRestBind<string, any>]>;
// type Test6 = IsRestBind<never, number>;
// type Test7 = number extends never ? true : false
// type Excluded8 = Exclude<[number, number], [never, never]>;
// type Test6 = FancyExcludeArrayV2Helper<Excluded8, [number, number], [never, never]>;
// type Test7 = FancyExcludeArrayV2<[number, number], [never, never]>;

type Shift<T extends unknown[]> = T extends [infer First, ...infer Rest] ? Rest : T;
// type MergeArr<T extends unknown[]> = T extends (infer TArr)[] ? (TArr[] extends T ? TArr[] : T) : T;

// type Test4 = HasRestBind<[number, number, RestBind<string, any>]>;
// // type Merged = MergeArr<[number, ...number[]]>
// // type Test3 = Extends<number[], [number, ...number[]]>

// type Excluded2 = FancyExcludeArrayV2<number[], [number, number]>;
// type Excluded3 = FancyExcludeArrayV2<number[], [number, number, RestBind<string, any>]>;
// type Excluded4 = FancyExcludeArrayV2<number[], [number, RestBind<string, any>]>;
// // type Excluded4 = FancyExcludeArrayV2<Excluded3, [number]>;
// // type Excluded5 = Exclude<number[], [number]>

// type Fancy = FancyExcludeArray<[number, number], [number, number]>;

// type FancyExcludeObject<
//   T extends Record<PropertyKey, unknown>,
//   U extends Record<PropertyKey, unknown>
// > = U extends PartialObjectPattern<T> ? Exclude<T, ResolvePartial<U, T>> : Exclude<T, U>;

// type ExtendsPartial<T, U> = T extends Partial<U> ? T : U;

// type ResolvePartial<T, U> = {
//   [key in keyof U]: key extends keyof T ? T[key] : U[key];
// };

// type FancyExcludeObjectHelper<
//   T extends Record<PropertyKey, unknown>,
//   U extends Record<PropertyKey, unknown>
// > = PartialObjectPattern<T> extends U ? never : T

// type FancyExcluded = FancyExcludeObject<
//   { x: 1; y: 2; z: 3 } | { x: "a"; y: 2; z: 3 },
//   { x: 1; [ObjectRestSymbol]: PredicateBind<string, any> }
// >;

// type FancyExcludeHelper<T, U> = T extends (infer TArr)[]
//   ? U extends EmptyArray
//     ? NonEmptyArray<TArr>
//     : U extends NonEmptyArray<TArr>
//     ? EmptyArray
//     : Exclude<T, U>
//   : Exclude<T, U>;

type FancyExcludeHelper<T extends unknown[], U extends unknown[]> = Exclude<any, U> extends never
  ? never
  : U extends [RestBind<string, any>, ...any[]] | [...any[], RestBind<string, any>]
  ? FancyExcludeArray<T, U>
  : Exclude<T, U>;

// type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
// type IsAny<T> = IfAny<T, true, never>;
// type Test2 = Extends<[any, any], [0 & 1, ...any[]] | [...any[], 0 & 1]>
// type Test3 = Extends<any, 0 & 1>
// type FancyExcludeHelper<T extends unknown[], U extends unknown[]> = Exclude<any, U> extends never
//   ? never
//   : U extends [infer TBind1 extends RestBind<string, any>, ...any[]]
//   ? Exclude<any, TBind1> extends never
//     ? U extends [...any[], infer TBind2 extends RestBind<string, any>]
//       ? Exclude<any, TBind2> extends never
//         ? Exclude<T, U>
//         : FancyExcludeArray<T, U>
//       : Exclude<T, U>
//     : Exclude<T, U>
//   : Exclude<T, U>;

export type FancyExclude<T, U> = U extends unknown[]
  ? T extends unknown[]
    ? FancyExcludeHelper<T, U>
    : Exclude<T, U>
  : Exclude<T, U>;

// type Test = ExtendsAll<string | number, number>;
// type Test2 = Extends<string | number, number>;
// type Test3 = ExtendsAll<number, number>;

// type Excluded = FancyExcludeArray<number[], [number, RestBind<string, number>]>;

// type Resolved2 = ResolveNonLiteralToNever<[PredicateBind<"first", any>, PredicateRestBind<"rest", any>]>;
// type Test = Extends<Resolved2, [RestBind<string, any>, ...any[]] | [...any[], RestBind<string, any>]>;

// // type Test2 = Extends<[Exclude<any, Resolved2>], [never]>

// type ExcludeThree = FancyExclude<number[], Resolved2>;

// const SymbolForFail = Symbol("fail");
// type __INTERNAL__Fail = typeof SymbolForFail;

// type FancyExcludeArrayV3Helper<T extends unknown[], U extends unknown[]> = T extends (infer TArr)[]
//   ? U extends [infer First, ...infer Rest]
//     ? StrictExtends : TArr extends First
//       ? FancyExcludeArrayV3Helper<T, Rest> extends unknown[]
//         ? [TArr, ...FancyExcludeArrayV3Helper<T, Rest>]
//         : __INTERNAL__Fail
//       : __INTERNAL__Fail
//     : __INTERNAL__Fail
//   : __INTERNAL__Fail;

// type IsAny<T> = MaybeTrue<T extends never & boolean ? true : false>;

// type StrictExtends<T, U> = T extends U ? (IsAny<T> extends true ? (IsAny<U> extends true ? true : false) : true) : false;

// type StrictExtendsTest = StrictExtends<true, true>

// type FancyExcludeArrayV3<T extends unknown[], U extends unknown[]> = FancyExcludeArrayV3Helper<T, U> extends unknown[]
//   ? Shift<FancyExcludeArrayV3Helper<T, U>>
//   : Exclude<Test, U>;
