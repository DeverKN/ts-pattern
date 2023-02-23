import { AssertNever, NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/pattern";
import { HandlerFunc, matchPatterns, PatternListForMatch } from "./matcherEngine";

export type MatchObject<TMatch, TReturn> = {
  match: TMatch;
  patterns: PatternListForMatch<TMatch, TReturn>;
};

export const makeMatchObject = <TMatch, TPatterns extends PatternListForMatch<TMatch, TReturn>, TReturn>(
  match: TMatch,
  patterns: TPatterns
): MatchObject<TMatch, TReturn> => {
  return {
    match,
    patterns,
  };
};

export const against = <TMatch, TExistingReturn, TReturn, TPattern extends Pattern<TMatch>>(
  matchObj: MatchObject<TMatch, TExistingReturn>,
  pattern: TPattern,
  handler: HandlerFunc<TMatch, TPattern, TReturn>
): MatchObject<FallthroughMatches<TMatch, TPattern>, TExistingReturn | TReturn> => {
  type Fallthrough = FallthroughMatches<TMatch, TPattern>;
  const { match, patterns } = matchObj;
  return {
    match: match as Fallthrough,
    patterns: [...patterns, [pattern, handler]] as PatternListForMatch<Fallthrough, TReturn>
  };
};

export const isNonExhaustiveError = (maybeError: NonExhaustiveError<unknown> | unknown): maybeError is NonExhaustiveError<unknown> => {
  return maybeError !== null && typeof maybeError === "object" && (maybeError as Record<string, unknown>)._nonExhaustive === null;
};

export const exhaustive = <TMatch, TReturn>(
  matchObj: MatchObject<TMatch, TReturn>
): AssertNever<TMatch, TReturn, NonExhaustiveError<TMatch>> => {
  const { match, patterns } = matchObj;
  const result = matchPatterns(match, patterns);
  return result as AssertNever<TMatch, TReturn, NonExhaustiveError<TMatch>>;
};

export const fallback = <TMatch, TFallbackReturn, TReturn>(
  matchObj: MatchObject<TMatch, TReturn>,
  fallbackFunction: (val: TMatch) => TFallbackReturn
): AssertNever<TMatch, TReturn, TFallbackReturn> => {
  const { match, patterns } = matchObj;
  const result = matchPatterns(match, patterns);
  if (isNonExhaustiveError(result)) {
    return fallbackFunction(match) as AssertNever<TMatch, TReturn, TFallbackReturn>;
  } else {
    return result as AssertNever<TMatch, TReturn, TFallbackReturn>;
  }
};

export const run = <TMatch, TReturn>(matchObj: MatchObject<TMatch, TReturn>): TReturn | undefined => {
  const { match, patterns } = matchObj;
  const result = matchPatterns(match, patterns);
  if (isNonExhaustiveError(result)) {
    return undefined;
  } else {
    return result;
  }
};

export const assertRun = <TMatch, TReturn>(matchObj: MatchObject<TMatch, TReturn>): TReturn => {
  const { match, patterns } = matchObj;
  const result = matchPatterns(match, patterns);
  if (isNonExhaustiveError(result)) {
    throw Error(`Pattern is not exhaustive for input ${JSON.stringify(match)}`);
  } else {
    return result;
  }
};
