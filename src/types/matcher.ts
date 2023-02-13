import { PredicateBind, MatchBind } from "./bind";
import { ResolveNonLiteralToNever } from "./resolve";

export type FallthroughMatches<TTest, TPattern> = TPattern extends PredicateBind<string, infer T> ? Exclude<TTest, ResolveNonLiteralToNever<T>> :
                                                  TPattern extends MatchBind<string, infer TMatch> ? Exclude<TTest, ResolveNonLiteralToNever<TMatch>> :
                                                  Exclude<TTest, ResolveNonLiteralToNever<TPattern>>