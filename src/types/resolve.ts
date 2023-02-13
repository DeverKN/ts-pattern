import { MatchBind, MatchRestBind, PredicateBind, PredicateRestBind } from "./bind";
import { IsLiteral } from "./helpers/IsLiteral";
import { Narrow } from "./helpers/narrow";
import { Primitive } from "./helpers/primitives";

type ResolveArray<TPattern extends unknown[]> = TPattern extends [PredicateRestBind<string, infer Type>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<Type, ArrayType>[]
    : never
  : TPattern extends [MatchRestBind<string, infer TMatch>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<Resolve<TMatch>, ArrayType>[]
    : never
  : TPattern extends [infer First, ...infer Rest]
  ? [Resolve<First>, ...ResolveArray<Rest>]
  : TPattern extends unknown[]
  ? TPattern
  : never;

type ResolveObject<TPattern extends Record<PropertyKey, unknown>> = {
  [Key in keyof TPattern]: Resolve<TPattern[Key]>;
};

// type Resolved = [ResolveObject<{ x: 1; y: 2 }>, ResolveObject<{ x: 3; y: 4 }>];

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

type ResolveNonLiteralToNeverArray<TPattern extends unknown[]> = TPattern extends [PredicateRestBind<string, infer Type>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<Type, ArrayType>[]
    : never
  : TPattern extends [MatchRestBind<string, infer TMatch>]
  ? TPattern extends (infer ArrayType)[]
    ? Narrow<ResolveNonLiteralToNever<TMatch>, ArrayType>[]
    : never
  : TPattern extends [infer First, ...infer Rest]
  ? [ResolveNonLiteralToNever<First>, ...ResolveNonLiteralToNeverArray<Rest>]
  : TPattern extends unknown[]
  ? TPattern
  : never;

type ResolveNonLiteralToNeverObject<TPattern extends Record<PropertyKey, unknown>> = {
  [Key in keyof TPattern]: ResolveNonLiteralToNever<TPattern[Key]>;
};

export type ResolveNonLiteralToNever<TPattern> = TPattern extends MatchBind<string, infer TMatch>
  ? Narrow<ResolveNonLiteralToNever<TMatch>, TPattern>
  : TPattern extends PredicateBind<string, infer Type>
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
