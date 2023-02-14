import { NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/spec";
import { against, assertRun, exhaustive, fallback, isNonExhaustiveError, makeMatchObject, MatchObject, run } from "./match";
import { HandlerFunc } from "./matcherEngine";

// export type Matcher<TMatch, TReturn> = {
//   against: <TPattern extends Pattern<TMatch>, THandlerReturn>(
//     pattern: TPattern,
//     handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
//   ) => Matcher<FallthroughMatches<TMatch, TPattern>, TReturn | THandlerReturn>;
//   exhaustive: [TMatch] extends [never] ? () => TReturn : NonExhaustiveError;
//   fallback: <TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) => TReturn | TFallbackReturn;
//   run: () => TReturn;
// };

export class Matcher<TMatch, TReturn> {
  #matchObj: MatchObject<TMatch, TReturn>;
  constructor(matchObj: MatchObject<TMatch, TReturn>) {
    this.#matchObj = matchObj
  }

  against<TPattern extends Pattern<TMatch>, THandlerReturn>(
    pattern: TPattern,
    handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
  ): Matcher<FallthroughMatches<TMatch, TPattern>, TReturn | THandlerReturn> {
    return new Matcher(against(this.#matchObj, pattern, handler))
  }

  get exhaustive(): [TMatch] extends [never] ? () => TReturn : NonExhaustiveError {
    type ExhaustiveReturnType = [TMatch] extends [never] ? () => TReturn : NonExhaustiveError
    const result = exhaustive(this.#matchObj);
    if (isNonExhaustiveError(result)) {
      return result as ExhaustiveReturnType;
    } else {
      return (() => result) as ExhaustiveReturnType;
    }
  }

  fallback<TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) {
    return fallback(this.#matchObj, fallbackFunction)
  }

  run() {
    return run(this.#matchObj)
  }

  assertRun() {
    return assertRun(this.#matchObj)
  }
}

export const match = <TTest>(test: TTest): Matcher<TTest, never> => {
  return new Matcher(makeMatchObject(test, []))
};