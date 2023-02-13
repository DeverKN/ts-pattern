import { Bind, MatchBind, PredicateBind } from "../types/bind";
import { ExtractBinds } from "../types/extract";
import { Primitive } from "../types/helpers/primitives";
import { ObjectPattern, Pattern, PrimitivePattern, StringArrayPattern, StringLiteralPattern, StringPattern } from "../types/spec";

export type HandlerFunc<TMatch, TPattern, TReturn, TBinds = ExtractBinds<TMatch, TPattern>> = (binds: TBinds) => TReturn;
type PatternListForMatch<TMatch> = PatternList<TMatch, Pattern<TMatch>>;
type PatternList<TMatch, TPattern> = [TPattern, HandlerFunc<TMatch, TPattern, unknown>][];

type MatchResult = [isMatch: boolean, binds: Record<string, unknown>];

const isPredicateBind = <TBind extends PredicateBind<string, unknown> = PredicateBind<string, unknown>>(
  arg: unknown | TBind
): arg is TBind => {
  return true;
};

const isMatchBind = <TBind extends MatchBind<string, unknown> = MatchBind<string, unknown>>(
  arg: unknown | TBind
): arg is TBind => {
  return true;
};

const isBind = <TBind extends Bind<string, unknown> = Bind<string, unknown>>(arg: unknown | TBind): arg is TBind => {
  return true;
};

export const matchPatterns = <T>(match: T, patterns: PatternListForMatch<T>) => {};

export const matchBase = <T>(match: T, pattern: Pattern<T>): MatchResult => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return void 0 as any;
};

export const matchString = <T extends string>(match: T, pattern: StringPattern<T>): MatchResult => {
  return [match === pattern, {}];
};

export const matchStringLiteral = <T extends string>(match: T, pattern: StringLiteralPattern<T>): MatchResult => {
  return [match === pattern, {}];
};

const resolveStringMatchBindToRegexString = (pattern: MatchBind<string, PredicateBind<string, string> | StringPattern<string>>): string => {
  const { match } = pattern
  if (typeof match !== "string") {
    if (!Array.isArray(match)) {
      switch (match.bindType) {
        case "matchBind":
          return `(${resolveStringMatchBindToRegexString(match)})`;
        case "predicateBind":
          return `(.*)`;
        case "predicateWildCard":
          return `(?:.*)`;
      }
    } else {
      return convertStringArrayPatternToRegexString(match)
    }
  } else {
    return match
  }
  return ""
}
const convertStringArrayPatternToRegexString = (pattern: StringArrayPattern): string => {
  return pattern
    .map((curr) => {
      if (isBind(curr)) {
        switch (curr.bindType) {
          case "matchBind":
            return `(${resolveStringMatchBindToRegexString(curr.match)})`;
          case "predicateBind":
            return `(.*)`;
          case "predicateWildCard":
            return `(?:.*)`;
        }
      }
      return curr;
    })
    .join("");
  // return new RegExp(regexString);
};

export const matchStringArray = (match: string, pattern: StringArrayPattern): MatchResult => {
  const patternRegex = convertStringArrayPatternToRegex(pattern);
  return [true, {}];
};

export const matchPrimitive = <T extends Primitive>(match: T, pattern: PrimitivePattern<T>): MatchResult => {
  return [match === pattern, {}];
};

export const matchPredicateBind = <T>(match: T, pattern: PredicateBind<string, T>): MatchResult => {
  const { label, predicate } = pattern;
  const isMatch = predicate(match);
  if (isMatch) {
    return [true, { [label]: match }];
  } else {
    return [false, { [label]: match }];
  }
};

export const matchMatchBind = <T>(match: T, pattern: MatchBind<string, T>): MatchResult => {
  const { label, match: patternMatch } = pattern;
  const [isMatch, binds] = matchBase(match, patternMatch);
  if (isMatch) {
    return [isMatch, { ...binds, [label]: match }];
  } else {
    return [isMatch, { ...binds, [label]: match }];
  }
};

export const matchCompleteObject = <T extends Record<PropertyKey, unknown>>(match: T, pattern: ObjectPattern<T>): MatchResult => {
  return Object.entries(match)
    .map(([key, val]) => {
      const patternVal = pattern[key];
      return matchBase(val, patternVal);
    })
    .reduce(
      ([prevIsMatch, prevBinds], [currIsMatch, currBinds]) => {
        if (!prevIsMatch) return [false, {}];
        if (!currIsMatch) return [false, {}];
        return [true, { ...prevBinds, ...currBinds }];
      },
      [true, {}]
    );
};
