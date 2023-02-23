import { Bind, MatchBind, PredicateBind, PredicateWildCard, RestBind, SymbolForBind } from "../types/bind";
import { ExtractBinds } from "../types/extract";
import { AnyObject } from "../types/helpers/AnyObject";
import { NonExhaustiveError } from "../types/helpers/AssertNever";
import { Primitive } from "../types/helpers/primitives";
import {
  ArrayPattern,
  GenericListPattern,
  ObjectPattern,
  ObjectRestSymbol,
  PartialObjectPattern,
  Pattern,
  PrimitivePattern,
  StringArrayPattern,
  StringLiteralPattern,
  StringPattern,
} from "../types/pattern";

export type HandlerFunc<TMatch, TPattern, TReturn, TBinds = ExtractBinds<TMatch, TPattern>> = (binds: TBinds) => TReturn;
export type PatternListForMatch<TMatch, TReturn> = PatternList<TMatch, Pattern<TMatch>, TReturn>;
type PatternList<TMatch, TPattern, TReturn> = [TPattern, HandlerFunc<TMatch, TPattern, TReturn>][];

type MatchResult = [isMatch: boolean, binds: Record<string, unknown>];

const hasOwnProperty = (o: object, v: PropertyKey) => Object.hasOwnProperty.call(o, v);

export const isPredicateBind = <TBind extends PredicateBind<string, unknown> = PredicateBind<string, unknown>>(
  arg: unknown | TBind
): arg is TBind => {
  return isBind(arg) && arg.bindType === "predicateBind";
};

export const isMatchBind = <TBind extends MatchBind<string, unknown> = MatchBind<string, unknown>>(
  arg: unknown | TBind
): arg is TBind => {
  return isBind(arg) && arg.bindType === "matchBind";
};

export const isRestBind = <TBind extends RestBind<string, unknown> = RestBind<string, unknown>>(arg: unknown | TBind): arg is TBind => {
  return isBind(arg) && (arg.bindType === "matchRestBind" || arg.bindType === "predicateRestBind");
};

export const isWildCard = <TBind extends PredicateWildCard<unknown> = PredicateWildCard<unknown>>(arg: unknown | TBind): arg is TBind => {
  return isBind(arg) && (arg.bindType === "predicateWildCard");
};

type BindOrRestBindOrWildCard = Bind<string, unknown> | RestBind<string, unknown> | PredicateWildCard<unknown>;
export const isBind = (arg: unknown | BindOrRestBindOrWildCard): arg is BindOrRestBindOrWildCard => {
  return arg !== null && arg !== undefined && hasOwnProperty(arg, SymbolForBind);
};

export const matchPatterns = <T, TReturn>(match: T, patterns: PatternListForMatch<T, TReturn>): TReturn | NonExhaustiveError<unknown> => {
  if (patterns.length === 0) return { __nonExhaustive: null };
  const [firstPattern, ...restPatterns] = patterns;
  const [pattern, handlerFunc] = firstPattern;
  const [isMatch, binds] = matchBase(match, pattern);
  if (isMatch) {
    type BindTypes = ExtractBinds<T, Pattern<T>>
    return handlerFunc(binds as BindTypes)
  } else {
    return matchPatterns(match, restPatterns);
  }
};

const matchBase = <T>(match: T, pattern: Pattern<T>): MatchResult => {
  if (pattern === undefined) {
    return [match === undefined, {}]
  }
  if (isWildCard(pattern)) {
    return matchWildcard(match, pattern)
  } else if (isMatchBind(pattern)) {
    return matchMatchBind(match, pattern);
  } else if (isPredicateBind(pattern)) {
    return matchPredicateBind(match, pattern);
  } else if (match === null) {
    return [pattern === null, {}];
  } else if (Array.isArray(match)) {
    const arrayPattern: ArrayPattern<typeof match> = pattern as ArrayPattern<typeof match>;
    return matchArray(match, arrayPattern);
  } else if (typeof match === "string") {
    const stringPattern: StringPattern<typeof match> = pattern as StringPattern<typeof match>;
    return matchString(match, stringPattern);
  } else if (typeof match === "object") {
    const objectToMatch = match as Record<string, unknown>;
    const objectPattern: ObjectPattern<typeof objectToMatch> = pattern as ObjectPattern<typeof objectToMatch>;
    return matchObject(objectToMatch, objectPattern);
  } else {
    return matchPrimitive(match as Primitive, pattern as Primitive);
  }
};

const matchString = <T extends string>(match: T, pattern: StringPattern<T>): MatchResult => {
  if (Array.isArray(pattern)) {
    return matchStringArray(match, pattern);
  } else {
    return matchStringLiteral(match, pattern);
  }
};

const matchStringLiteral = <T extends string>(match: T, pattern: StringLiteralPattern<T>): MatchResult => {
  return [match === pattern, {}];
};

const convertStringArrayPatternElementToRegexElement = (el: string | Bind<string, string> | StringArrayPattern): string => {
  if (Array.isArray(el)) {
    return el.map(convertStringArrayPatternElementToRegexElement).join("");
  } else {
    if (typeof el === "string") {
      return el;
    } else {
      switch (el.bindType) {
        case "matchBind": {
          const { match, label } = el;
          return `(?<${label}>${convertStringArrayPatternElementToRegexElement(match)})`;
        }
        case "predicateBind": {
          const { label } = el;
          return `(?<${label}>.*)`;
        }
        case "predicateWildCard":
          return `(?:.*)`;
      }
    }
  }
};

const matchStringArray = (match: string, pattern: StringArrayPattern): MatchResult => {
  const patternRegex = new RegExp(convertStringArrayPatternElementToRegexElement(pattern));
  const result = patternRegex.exec(match);
  if (!result) return [false, {}];
  const [matchedSection] = result;
  const { groups, input } = result;
  const isMatch = matchedSection === input;
  if (!isMatch) return [false, {}];
  const matches = groups ?? {};
  return [true, matches];
};

const matchPrimitive = <T extends Primitive>(match: T, pattern: PrimitivePattern<T>): MatchResult => {
  return [match === pattern, {}];
};

const matchWildcard = <T>(match: T, pattern: PredicateWildCard<T>): MatchResult => {
  const { predicate } = pattern;
  const isMatch = predicate(match);
  if (isMatch) {
    return [true, {}];
  } else {
    return [false, {}];
  }
};

const matchPredicateBind = <T>(match: T, pattern: PredicateBind<string, T>): MatchResult => {
  const { label, predicate } = pattern;
  const isMatch = predicate(match);
  if (isMatch) {
    return [true, { [label]: match }];
  } else {
    return [false, {}];
  }
};

const matchMatchBind = <T>(match: T, pattern: MatchBind<string, T>): MatchResult => {
  const { label, match: patternMatch } = pattern;
  const [isMatch, binds] = matchBase(match, patternMatch);
  if (isMatch) {
    return [isMatch, { ...binds, [label]: match }];
  } else {
    return [false, {}];
  }
};

const isPartialMatchObject = <T extends Record<PropertyKey, unknown>, TPattern extends PartialObjectPattern<T>>(
  maybePartial: TPattern | unknown
): maybePartial is TPattern => {
  return maybePartial !== null && typeof maybePartial === "object" && hasOwnProperty(maybePartial, ObjectRestSymbol);
};

const matchObject = <T extends Record<PropertyKey, unknown>>(match: T, pattern: ObjectPattern<T>): MatchResult => {
  if (isPartialMatchObject(pattern)) {
    return matchPartialObject(match, pattern);
  } else {
    return matchCompleteObject(match, pattern);
  }
};

const getSymbols = (obj: AnyObject): [symbol, unknown][] => {
  return Object.getOwnPropertySymbols(obj).map((symbolName) => [symbolName, obj[symbolName]])
}

const getSymbolsAndEntries = (obj: AnyObject) => {
  return [...Object.entries(obj), ...getSymbols(obj)]
}

const matchCompleteObject = <T extends Record<PropertyKey, unknown>>(match: T, pattern: ObjectPattern<T>): MatchResult => {
  return getSymbolsAndEntries(match).reduce<MatchResult>(
    ([prevIsMatch, prevBinds], [key, val]) => {
      const [isMatch, binds] = matchBase(val, pattern[key]);
      if (!prevIsMatch) return [false, {}];
      if (!isMatch) return [false, {}];
      return [true, { ...prevBinds, ...binds }];
    },
    [true, {}]
  );
};

const matchPartialObject = <T extends Record<PropertyKey, unknown>>(match: T, pattern: PartialObjectPattern<T>): MatchResult => {
  const fallthroughKeys: Record<string, unknown> = {};
  const fallthroughBind = pattern[ObjectRestSymbol];
  const fallthroughIsWildcard = fallthroughBind.bindType === "predicateWildCard";
  const fallthroughLabel = fallthroughBind.bindType === "predicateBind" ? fallthroughBind.label : "";

  return Object.entries(match).reduce<MatchResult>(
    ([prevIsMatch, prevBinds], [key, val]): MatchResult => {
      if (!prevIsMatch) return [false, {}];

      const patternVal = pattern[key];

      if (patternVal) {
        return mergeMatchResults([prevIsMatch, prevBinds], matchBase(val, patternVal));
      } else {
        fallthroughKeys[key] = val;
        if (fallthroughIsWildcard) {
          return [true, { ...prevBinds }];
        } else {
          const prevFallthrough = prevBinds[fallthroughLabel] ?? {};
          return [true, { ...prevBinds, [fallthroughLabel]: { ...prevFallthrough, [key]: val } }];
        }
      }
    },
    [true, {}]
  );
};

type ArrayObject<T> = {
  [key in keyof T]: T[key][];
};

const mergeObjectWithObjectOfArrays = <T extends Record<string, unknown>>(
  arrayObject: Partial<ArrayObject<T>>,
  obj: T
): ArrayObject<T> => {
  const entries = Object.entries(obj).map(([key, val]) => {
    const entry: [string, unknown[]] = [key, [...(arrayObject[key] ?? []), val]];
    return entry;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return Object.fromEntries<unknown[]>(entries) as ArrayObject<T>;
};

const handleRestBind = <T, TArr extends T[]>(arr: TArr, restBind: RestBind<string, T>): MatchResult => {
  switch (restBind.bindType) {
    case "matchRestBind": {
      const { match, label } = restBind;
      const [isMatch, els, binds] = arr.reduce<[boolean, T[], Record<string, unknown[]>]>(
        ([prevIsMatch, prevEls, prevBinds], el) => {
          if (!prevIsMatch) return [false, [], {}];
          const [isMatch, binds] = matchBase(match, el);
          if (isMatch) {
            return [true, [...prevEls, el], mergeObjectWithObjectOfArrays(prevBinds, binds)];
          } else {
            return [false, [], {}];
          }
        },
        [true, [], {}]
      );
      if (isMatch) {
        return [true, { ...binds, [label]: els }];
      } else {
        return [false, {}];
      }
    }
    case "predicateRestBind": {
      const { predicate, label } = restBind;
      const [isMatch, els] = arr.reduce<[boolean, T[]]>(
        ([prevIsMatch, prevEls], el) => {
          if (!prevIsMatch) return [false, []];
          return [predicate(el), [...prevEls, el]];
        },
        [true, []]
      );
      if (isMatch) {
        return [true, { [label]: els }];
      } else {
        return [false, {}];
      }
    }
  }
};

const mergeMatchResults = (firstResult: MatchResult, secondResult: MatchResult): MatchResult => {
  const [firstIsMatch, firstBinds] = firstResult;
  const [secondIsMatch, secondBinds] = secondResult;
  if (!firstIsMatch || !secondIsMatch) return [false, {}];
  return [true, { ...firstBinds, ...secondBinds }];
};

const matchArrayHelper = <T, TArr extends T[]>(arr: TArr, pattern: GenericListPattern<T>): MatchResult => {
  if (pattern.length === 0) {
    if (pattern.length === arr.length) {
      return [true, {}];
    } else {
      return [false, {}];
    }
  }

  const [patternFirst, ...patternRest] = pattern;

  if (isRestBind(patternFirst)) {
    return handleRestBind(arr, patternFirst);
  } else {
    if (arr.length === 0) {
      if (pattern.length === arr.length) {
        return [true, {}];
      } else {
        return [false, {}];
      }
    }
    
    const [arrFirst, ...arrRest] = arr;
    return mergeMatchResults(matchBase(arrFirst, patternFirst), matchArrayHelper(arrRest, patternRest));
  }
};

// const matchStartingRestBindHelper = <T>(
//   arr: T[],
//   restBind: RestBind<string, T>
// ): [binds: Record<string, unknown[]>, els: T[], remainder: T[]] => {
//   if (arr.length === 0) return [{}, [], []]
//   const [first, ...rest] = arr;
//   switch (restBind.bindType) {
//     case "matchRestBind": {
//       const { match } = restBind;
//       const [isMatch, binds] = matchBase(match, first);
//       if (isMatch) {
//         const [restBinds, restEls, restRemainder] = matchStartingRestBindHelper<T>(rest, restBind);
//         const mergedBinds = mergeObjectWithObjectOfArrays(restBinds, binds);
//         return [mergedBinds, [first, ...restEls], restRemainder];
//       } else {
//         return [{}, [], arr];
//       }
//     }
//     case "predicateRestBind": {
//       const { predicate } = restBind;
//       if (predicate(first)) {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const [_, restEls, restRemainder] = matchStartingRestBindHelper<T>(rest, restBind);
//         return [{}, [first, ...restEls], restRemainder];
//       } else {
//         return [{}, [], arr];
//       }
//     }
//   }
// };

const restAndLast = <T>(arr: T[]): [rest: T[], last: T] => {
  const rest = arr.slice(0, arr.length - 1)
  const last = arr[arr.length - 1]
  return [rest, last]
}

const matchStartingRestBind = <T, TArr extends T[]>(
  arr: TArr,
  pattern: ArrayPattern<TArr>
): MatchResult => {
  // const [binds, els, remainder] = matchStartingRestBindHelper(arr, restbind);
  //match from the end of the array backwards
  const [arrRest, arrLast] = restAndLast(arr)
  const [patternRest, patternLast] = restAndLast(pattern)
  if (isRestBind(patternLast)) {
    return handleRestBind(arr, patternLast);
  } else {
    return mergeMatchResults(matchBase(arrLast, patternLast), matchArrayHelper(arrRest, patternRest));
  }
  // console.log({binds, els, remainder})
  // const { label } = restbind;
  // const [restIsMatch, restBinds] = matchArrayHelper(remainder, pattern);
  // if (restIsMatch) {
  //   return [true, { ...binds, [label]: els, ...restBinds }];
  // } else {
  //   return [false, {}];
  // }
};

const matchArray = <T, TArr extends T[]>(arr: TArr, pattern: ArrayPattern<TArr>): MatchResult => {
  // console.log({arr, pattern})
  const [first] = pattern;
  if (isRestBind(first)) {
    return matchStartingRestBind(arr, pattern);
  } else {
    return matchArrayHelper(arr, pattern);
  }
};
