import { ArrayVals } from "./helpers/ArrayVals";
import { Bind, PredicateBind, PredicateWildCard, RestBind } from "./bind";
import { Primitive } from "./helpers/primitives";

export const ObjectRestSymbol = Symbol("objectRest");

export type PrimitivePattern<T> = T;

export type StringLiteralPattern<T extends string> = T;
export type StringArrayPattern = (string | Bind<string, string>)[];
export type StringPattern<T extends string> = StringLiteralPattern<T> | StringArrayPattern;

type EmptyArrayPattern = [];

export type GenericListPattern<T> = (T | Bind<string, T> | RestBind<string, T>)[];
type RestStartListPattern<TArr> = [TArr | RestBind<string, TArr> | Bind<string, TArr>, ...(TArr | Bind<string, TArr>)[]];
type RestEndListPattern<TArr> = [...(TArr | Bind<string, TArr>)[], TArr | Bind<string, TArr> | RestBind<string, TArr>];
type ListPatternHelper<T extends unknown[]> = T extends (infer TArr)[]
  ? RestStartListPattern<TArr> | RestEndListPattern<TArr>
  : never;

type ArrayPatternHelper<T extends unknown[]> = T extends never[]
  ? EmptyArrayPattern
  : T extends [infer First, ...infer Rest]
  ? Rest extends never[]
    ? [Pattern<First>] | [RestBind<string, ArrayVals<T>>]
    : [Pattern<First>, ...ArrayPatternHelper<Rest>] | [RestBind<string, ArrayVals<T>>]
  : T extends unknown[]
  ? ListPatternHelper<T>
  : never;

export type ArrayPattern<T extends unknown[]> = T | ArrayPatternHelper<T>;

export type TotalObjectPattern<T extends Record<PropertyKey, unknown>> = {
  [Key in keyof T]: Pattern<T[Key]>;
};

export type PartialObjectPattern<T extends Record<PropertyKey, unknown>> = {
  [Key in keyof T]: Pattern<T[Key]> | never;
} & {
  [ObjectRestSymbol]: PredicateBind<string, unknown> | PredicateWildCard<unknown>;
};

export type ObjectPattern<T extends Record<PropertyKey, unknown>> =
  | T
  // | PartialObjectPattern<T>
  | TotalObjectPattern<T>;

type BasePattern<T> = T extends string
  ? StringPattern<T>
  : T extends Primitive
  ? T
  : T extends never[]
  ? EmptyArrayPattern
  : T extends unknown[]
  ? ArrayPattern<T>
  : T extends Record<string, unknown>
  ? ObjectPattern<T>
  : unknown;

export type Pattern<T> = T | Bind<string, T> | BasePattern<T>

// export type Pattern<T> = T extends string
//   ? StringPattern<T> | Bind<string, T>
//   : T extends Primitive
//   ? T | Bind<string, T>
//   : T extends never[]
//   ? EmptyArrayPattern | Bind<string, T>
//   : T extends unknown[]
//   ? ArrayPattern<T> | Bind<string, T>
//   : T extends Record<string, unknown>
//   ? ObjectPattern<T> | Bind<string, T>
//   : unknown;

export type PatternOrPredicateBind<T> = T | PredicateBind<string, T> | PredicateWildCard<T> | BasePattern<T>

// export type PatternOrPredicateBind<T> = T extends string
//   ? StringPattern<T> | PredicateBind<string, T>
//   : T extends Primitive
//   ? T | PredicateBind<string, T>
//   : T extends never[]
//   ? EmptyArrayPattern | PredicateBind<string, T>
//   : T extends unknown[]
//   ? ArrayPattern<T> | PredicateBind<string, T>
//   : T extends Record<string, unknown>
//   ? ObjectPattern<T> | PredicateBind<string, T>
//   : unknown;
