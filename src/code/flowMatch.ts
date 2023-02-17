import { AssertNever, NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/pattern";
import { HandlerFunc, matchPatterns, PatternListForMatch } from "./matcherEngine";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FlowMatchObject<TBase, TMatch, TReturn> = {
  patterns: PatternListForMatch<TMatch, TReturn>;
};

export const makeFlowMatchObject = <TBase, TMatch, TPatterns extends PatternListForMatch<TMatch, TReturn> = [], TReturn = never>(
  patterns: TPatterns
): FlowMatchObject<TBase, TMatch, TReturn> => {
  return {
    patterns,
  };
};

export const flowAgainst = <TBase, TMatch, TExistingReturn, TReturn, TPattern extends Pattern<TMatch>>(
  matchObj: FlowMatchObject<TBase, TMatch, TExistingReturn>,
  pattern: TPattern,
  handler: HandlerFunc<TMatch, TPattern, TReturn>
): FlowMatchObject<TBase, FallthroughMatches<TMatch, TPattern>, TExistingReturn | TReturn> => {
  type Fallthrough = FallthroughMatches<TMatch, TPattern>;
  const { patterns } = matchObj;
  return {
    patterns: [...patterns, [pattern, handler]] as PatternListForMatch<Fallthrough, TReturn>,
  };
};

export const isNonExhaustiveError = (maybeError: NonExhaustiveError | unknown): maybeError is NonExhaustiveError => {
  return maybeError !== null && typeof maybeError === "object" && (maybeError as Record<string, unknown>)._nonExhaustive === null;
};

export const flowExhaustive = <TBase, TMatch, TReturn>(
  matchObj: FlowMatchObject<TBase, TMatch, TReturn>
): ((test: TBase) => AssertNever<TMatch, TReturn, NonExhaustiveError>) => {
  const { patterns } = matchObj;
  return (match) => {
    const result = matchPatterns(match, patterns as PatternListForMatch<TBase, TReturn>);
    return result as AssertNever<TMatch, TReturn, NonExhaustiveError>;
  };
};

export const flowFallback = <TBase, TMatch, TFallbackReturn, TReturn>(
  matchObj: FlowMatchObject<TBase, TMatch, TReturn>,
  fallbackFunction: (val: TMatch) => TFallbackReturn
): ((test: TBase) => AssertNever<TMatch, TReturn, TFallbackReturn>) => {
  const { patterns } = matchObj;
  return (match) => {
    const result = matchPatterns(match, patterns as PatternListForMatch<TBase, TReturn>);
    if (isNonExhaustiveError(result)) {
      return fallbackFunction(match as unknown as TMatch) as AssertNever<TMatch, TReturn, TFallbackReturn>;
    } else {
      return result as AssertNever<TMatch, TReturn, TFallbackReturn>;
    }
  };
};

export const flowRun = <TBase, TMatch, TReturn>(matchObj: FlowMatchObject<TBase, TMatch, TReturn>): ((test: TBase) => TReturn | undefined) => {
  const { patterns } = matchObj;
  return (match) => {
    const result = matchPatterns(match, patterns as PatternListForMatch<TBase, TReturn>);
    if (isNonExhaustiveError(result)) {
      return undefined;
    } else {
      return result;
    }
  };
};

export const flowAssertRun = <TBase, TMatch, TReturn>(matchObj: FlowMatchObject<TBase, TMatch, TReturn>): ((test: TBase) => TReturn) => {
  const { patterns } = matchObj;
  return (match) => {
    const result = matchPatterns(match, patterns as PatternListForMatch<TBase, TReturn>);
    if (isNonExhaustiveError(result)) {
      throw Error(`Pattern is not exhaustive for input ${JSON.stringify(match)}`);
    } else {
      return result;
    }
  };
};
