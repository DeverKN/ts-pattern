import { FancyExclude } from "../future/ArrayExclude";
import { PredicateBind, MatchBind, PredicateWildCard } from "./bind";
// import { FancyExclude, FancyExcludeV2 } from "./nonEmptyArray";

import { ResolveNonLiteralToNever } from "./resolve";

export type FallthroughMatches<TTest, TPattern> = TPattern extends PredicateBind<string, infer T> ? FancyExclude<TTest, ResolveNonLiteralToNever<T>> :
                                                  TPattern extends PredicateWildCard<infer T> ? FancyExclude<TTest, ResolveNonLiteralToNever<T>> :
                                                  TPattern extends MatchBind<string, infer TMatch> ? FancyExclude<TTest, ResolveNonLiteralToNever<TMatch>> :
                                                  FancyExclude<TTest, ResolveNonLiteralToNever<TPattern>>