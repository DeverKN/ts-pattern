import { Bind, MatchBind, MatchRestBind, PredicateBind, PredicateRestBind, WildCard } from "./bind";
import { IsLiteral } from "./helpers/IsLiteral";
import { Narrow } from "./helpers/narrow";
import { Primitive } from "./helpers/primitives";

type ResolveArray<TPattern extends unknown[]> = TPattern extends never[]
  ? []
  : TPattern extends [any, ...infer Rest]
  ? [any, ...ResolveArray<Rest>]
  : TPattern extends [PredicateRestBind<string, infer Type>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<Type, ArrayType>[]
    : []
  : TPattern extends [MatchRestBind<string, infer TMatch>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<Resolve<TMatch>, ArrayType>[]
    : []
  : TPattern extends [infer First, ...infer Rest]
  ? [Resolve<First>, ...ResolveArray<Rest>]
  : TPattern extends (infer T extends Bind<string, unknown>)[]
  ? Resolve<T>[]
  : TPattern extends unknown[]
  ? TPattern
  : [];

type ResolveObject<TPattern extends Record<PropertyKey, unknown>> = {
  [Key in keyof TPattern]: Resolve<TPattern[Key]>;
};

export type Resolve<TPattern> = TPattern extends MatchBind<string, infer TMatch>
  ? Resolve<TMatch>
  : TPattern extends PredicateBind<string, infer Type>
  ? Type
  : TPattern extends unknown[]
  ? ResolveArray<TPattern>
  : TPattern extends Record<PropertyKey, unknown>
  ? ResolveObject<TPattern>
  : TPattern;

// type Resolved = Resolve<{ x: PredicateBind<"x", any> }>;

type ResolveNonLiteralToNeverArray<TPattern extends unknown[]> = TPattern extends [PredicateRestBind<infer Label, infer Predicate>]
  ? [PredicateRestBind<Label, Predicate>]
  : TPattern extends [MatchRestBind<infer Label, infer Match>]
  ? [MatchRestBind<Label, Match>]
  : TPattern extends [infer First, ...infer Rest]
  ? [ResolveNonLiteralToNever<First>, ...ResolveNonLiteralToNeverArray<Rest>]
  : TPattern extends unknown[]
  ? TPattern
  : [];

type ResolveNonLiteralToNeverObject<TPattern extends Record<PropertyKey, unknown>> = {
  [Key in keyof TPattern]: ResolveNonLiteralToNever<TPattern[Key]>;
};

export type ResolveNonLiteralToNever<TPattern> = TPattern extends MatchBind<string, infer TMatch>
  ? Narrow<ResolveNonLiteralToNever<TMatch>, TPattern>
  : TPattern extends PredicateBind<string, infer Type>
  ? Type
  : TPattern extends PredicateRestBind<infer Label, infer Type>
  ? PredicateRestBind<Label, Type>
  : TPattern extends WildCard<infer Type>
  ? Type
  : TPattern extends unknown[]
  ? ResolveNonLiteralToNeverArray<TPattern>
  : TPattern extends Record<PropertyKey, unknown>
  ? ResolveNonLiteralToNeverObject<TPattern>
  : TPattern extends Primitive
  ? IsLiteral<TPattern> extends true
    ? TPattern
    : never
  : never;
