import { FancyExclude } from "../future/ArrayExclude";
import { PredicateBind, MatchBind, PredicateWildCard } from "./bind";
import { FancyExcludeV2 } from "./nonEmptyArray";
// import { ExtractBinds } from "./extract";
// import { FancyExclude, FancyExcludeV2 } from "./nonEmptyArray";

import { ResolveNonLiteralToNever } from "./resolve";

export type FallthroughMatches<TTest, TPattern> = TPattern extends PredicateBind<string, infer T> ? FancyExcludeV2<TTest, ResolveNonLiteralToNever<T>> :
                                                  TPattern extends PredicateWildCard<infer T> ? FancyExcludeV2<TTest, ResolveNonLiteralToNever<T>> :
                                                  TPattern extends MatchBind<string, infer TMatch> ? FancyExcludeV2<TTest, ResolveNonLiteralToNever<TMatch>> :
                                                  FancyExcludeV2<TTest, ResolveNonLiteralToNever<TPattern>>

// type Test = FallthroughMatches<string, PredicateBind<"str", any>>