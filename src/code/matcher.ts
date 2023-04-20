import { NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/pattern";
import {
  against,
  assertRun,
  exhaustive,
  fallback,
  isNonExhaustiveError,
  makeMatchObject,
  MatchObject,
  run,
} from "./match";
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
    this.#matchObj = matchObj;
  }

  against<TPattern extends Pattern<TMatch>, THandlerReturn>(
    pattern: TPattern,
    handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
  ): AgainstReturnType<TMatch, TReturn, TPattern, THandlerReturn> {
    return new Matcher(against(this.#matchObj, pattern, handler)) as AgainstReturnType<TMatch, TReturn, TPattern, THandlerReturn>;
  }

  exhaustive(): TReturn {
    const result = exhaustive(this.#matchObj);
    return result as TReturn;
  }

  fallback<TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) {
    return fallback(this.#matchObj, fallbackFunction);
  }

  run() {
    return run(this.#matchObj);
  }

  assertRun() {
    return assertRun(this.#matchObj);
  }
}

type AgainstReturnType<TMatch, TReturn, TPattern, THandlerReturn> = [FallthroughMatches<TMatch, TPattern>] extends [
  never
]
  ? ExhaustiveMatcher<TReturn | THandlerReturn>
  : NonExhaustiveMatcher<FallthroughMatches<TMatch, TPattern>, TReturn | THandlerReturn>;

type ExhaustiveMatcher<TReturn> = {
  exhaustive: () => TReturn;
  run: () => TReturn;
  assertRun: () => TReturn;
};

type NonExhaustiveMatcher<TMatch, TReturn> = {
  fallback: <TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) => TReturn | TFallbackReturn;
  run: () => TReturn;
  assertRun: () => TReturn;
  against: <TPattern extends Pattern<TMatch>, THandlerReturn>(
    pattern: TPattern,
    handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
  ) => AgainstReturnType<TMatch, TReturn, TPattern, THandlerReturn>;
};

// class ExhaustiveMatcher<TMatch, TReturn> {
//   #matchObj: MatchObject<TMatch, TReturn>;
//   constructor(matchObj: MatchObject<TMatch, TReturn>) {
//     this.#matchObj = matchObj
//   }

//   exhaustive(): TReturn {
//     const result = exhaustive(this.#matchObj);
//     return result as TReturn
//   }

//   // fallback<TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) {
//   //   return fallback(this.#matchObj, fallbackFunction)
//   // }

//   run(): TReturn {
//     return run(this.#matchObj) as TReturn
//   }

//   assertRun() {
//     return assertRun(this.#matchObj)
//   }
// }

export const match = <TTest>(test: TTest): Matcher<TTest, never> => {
  return new Matcher(makeMatchObject(test, []));
};
