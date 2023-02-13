import { AssertNever, NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/spec";
import { HandlerFunc } from "./matcherEngine";

type MatchObject<TMatch, TReturn> = {
  match: TMatch;
  return: TReturn;
};

export const against = <TMatch, TExistingReturn, TReturn, TPattern extends Pattern<TMatch>>(
  match: TMatch,
  pattern: TPattern,
  handler: HandlerFunc<TMatch, TPattern, TReturn>
): FallthroughMatches<TMatch, TPattern> /*MatchObject<FallthroughMatches<TMatch, TPattern>, TExistingReturn | TReturn>*/ => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return void 0 as any
};

export const exhaustive = <TMatch, TReturn>(match: TMatch): AssertNever<TMatch, TReturn, NonExhaustiveError> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return void 0 as any;
}

export const fallback = <TMatch, TFallbackReturn, TReturn>(match: TMatch, fallbackFunction: (val: TMatch) => TFallbackReturn): TFallbackReturn | TReturn => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return void 0 as any;
}

export const run = <TMatch, TReturn>(match: TMatch): TReturn | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return void 0 as any;
}