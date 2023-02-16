import { ArrayOfObjectsToObjectOfArrays, MergeArrayObjects, ObjectToArrayObject } from "./helpers/ArrayObject";
import { Bind, MatchBind, MatchRestBind, PredicateBind, PredicateRestBind, RestBind } from "./bind";
import { Narrow, NarrowArray } from "./helpers/narrow";
import { Primitive } from "./helpers/primitives";
import { Resolve } from "./resolve";
import { StringArrayPattern, StringLiteralPattern } from "./pattern";
import { MergeObjects } from "./helpers/MergeObjects";
import { KVObject } from "./helpers/KVObject";
import { Flatten } from "./helpers/flatten";
import { EmptyObject } from "./helpers/EmptyObject";

export type KVBindObject<K extends PropertyKey, V> = KVObject<K, V> & { __bind: true };

type ExtractPredicateBind<TTest, TBind extends PredicateBind<string, unknown>> = TBind extends PredicateBind<infer Label, infer T>
  ? KVBindObject<Label, Narrow<T, TTest>>
  : EmptyObject;

type ExtractMatchBind<TTest, TBind extends MatchBind<string, unknown>> = TBind extends MatchBind<infer Label, infer TMatch>
  ? MergeObjects<KVBindObject<Label, Narrow<Resolve<TMatch>, TTest>>, ExtractBindsInteral<TTest, TMatch>>
  : EmptyObject;

type ExtractBind<TTest, TBind extends Bind<string, unknown>> = TBind extends PredicateBind<string, unknown>
  ? ExtractPredicateBind<TTest, TBind>
  : TBind extends MatchBind<string, unknown>
  ? ExtractMatchBind<TTest, TBind>
  : EmptyObject;

type ExtractPredicateRestBind<
  TTest extends unknown[],
  TBind extends PredicateRestBind<string, unknown>
> = TBind extends PredicateRestBind<infer Label, infer T> ? KVBindObject<Label, NarrowArray<T, TTest>> : EmptyObject;

type ExtractRestMatchBinds<TTest extends unknown[], TMatch> = TTest extends [infer First, ...infer Rest extends unknown[]]
  ? Rest extends never[]
    ? ObjectToArrayObject<ExtractBindsInteral<First, TMatch>>
    : MergeArrayObjects<ObjectToArrayObject<ExtractBindsInteral<First, TMatch>>, ExtractRestMatchBinds<Rest, TMatch>>
  : TTest extends (infer T)[]
  ? ArrayOfObjectsToObjectOfArrays<ExtractBindsInteral<T, TMatch>[]>
  : EmptyObject;

type ExtractMatchRestBind<TTest extends unknown[], TBind extends MatchRestBind<string, unknown>> = TBind extends MatchRestBind<
  infer Label,
  infer TMatch
>
  ? MergeObjects<KVBindObject<Label, NarrowArray<Resolve<TMatch>, TTest>>, ExtractRestMatchBinds<TTest, TMatch>>
  : EmptyObject;

type ExtractRestBind<TTest extends unknown[], TBind extends RestBind<string, TTest>> = TBind extends PredicateRestBind<
  string,
  unknown
>
  ? ExtractPredicateRestBind<TTest, TBind>
  : TBind extends MatchRestBind<string, any>
  ? ExtractMatchRestBind<TTest, TBind>
  : EmptyObject;

type ExtractPrimitiveBinds<TTest extends Primitive, TPattern> = TPattern extends Bind<string, unknown>
  ? ExtractBind<TTest, TPattern>
  : Record<string, never>;

type ExtractStringArrayBinds<TTest extends string, TPattern extends StringArrayPattern> = TPattern extends Bind<string, unknown>
  ? ExtractBind<TTest, TPattern>
  : Record<string, never>;

type ExtractStringLiteralBinds<TTest extends string, TPattern extends StringLiteralPattern<TTest>> = ExtractPrimitiveBinds<
  TTest,
  TPattern
>;

type ExtractStringBinds<TTest extends string, TPattern> = TPattern extends StringArrayPattern
  ? ExtractStringArrayBinds<TTest, TPattern>
  : TPattern extends StringLiteralPattern<TTest>
  ? ExtractStringLiteralBinds<TTest, TPattern>
  : EmptyObject;

type ExtractArrayBindsHelper<TTest extends unknown[], TPattern> = TPattern extends [infer PatternFirst, ...infer PatternRest]
  ? PatternFirst extends RestBind<string, any>
    ? ExtractRestBind<TTest, PatternFirst>
    : TTest extends [infer TFirst, ...infer TRest]
    ? TRest extends never[]
      ? ExtractBindsInteral<TFirst, PatternFirst>
      : MergeObjects<ExtractBindsInteral<TFirst, PatternFirst>, ExtractArrayBindsHelper<TRest, PatternRest>>
    : TTest extends (infer TArr)[]
    ? MergeObjects<ExtractBindsInteral<TArr, PatternFirst>, ExtractArrayBindsHelper<TTest, PatternRest>>
    : KVBindObject<"unknown", PatternFirst>
  : EmptyObject;

type ExtractArrayBindsReverseHelper<TTest extends unknown[], TPattern> = TPattern extends [
  ...infer PatternRest,
  infer PatternLast
]
  ? PatternLast extends RestBind<string, any>
    ? ExtractRestBind<TTest, PatternLast>
    : TTest extends [...infer TRest, infer TLast]
    ? TRest extends never[]
      ? ExtractBindsInteral<TLast, PatternLast>
      : MergeObjects<ExtractBindsInteral<TLast, PatternLast>, ExtractArrayBindsHelper<TRest, PatternRest>>
    : TTest extends (infer TArr)[]
    ? MergeObjects<ExtractBindsInteral<TArr, PatternLast>, ExtractArrayBindsHelper<TTest, PatternRest>>
    : KVBindObject<"unknown", PatternLast>
  : EmptyObject;

type ExtractArrayBinds<TTest extends unknown[], TPattern> = TPattern extends [infer PatternFirst, ...infer PatternRest]
  ? PatternFirst extends RestBind<string, any>
    ? ExtractArrayBindsReverseHelper<TTest, TPattern>
    : ExtractArrayBindsHelper<TTest, TPattern>
  : EmptyObject;

export type ExtractObjectBindsHelper<TTest extends Record<PropertyKey, unknown>, TPattern> = {
  [K in keyof TTest]: K extends keyof TPattern ? KVObject<K, ExtractBindsInteral<TTest[K], TPattern[K]>> : EmptyObject;
};

type ExtractObjectBinds<TTest extends Record<PropertyKey, unknown>, TPattern> = Flatten<
  ExtractObjectBindsHelper<TTest, TPattern>
>;

type Unbind<T> = Omit<T, "__bind">

type ExtractBindsInteral<TTest, TPattern> = TPattern extends Bind<string, unknown>
  ? ExtractBind<TTest, TPattern>
  : TTest extends string
  ? ExtractStringBinds<TTest, TPattern>
  : TTest extends Primitive
  ? ExtractPrimitiveBinds<TTest, TPattern>
  : TTest extends unknown[]
  ? ExtractArrayBinds<TTest, TPattern>
  : TTest extends Record<PropertyKey, unknown>
  ? ExtractObjectBinds<TTest, TPattern>
  : EmptyObject;

export type ExtractBinds<TTest, TPattern> = Unbind<ExtractBindsInteral<TTest, TPattern>>