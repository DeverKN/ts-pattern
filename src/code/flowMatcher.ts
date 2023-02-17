import { NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/pattern";
import { FlowMatchObject, flowAgainst, flowExhaustive, isNonExhaustiveError, flowFallback, flowRun, flowAssertRun, makeFlowMatchObject } from "./flowMatch";
import { HandlerFunc } from "./matcherEngine";

export class FlowMatcher<TBase, TMatch, TReturn> {
  #matchObj: FlowMatchObject<TBase, TMatch, TReturn>;
  constructor(matchObj: FlowMatchObject<TBase, TMatch, TReturn>) {
    this.#matchObj = matchObj
  }

  against<TPattern extends Pattern<TMatch>, THandlerReturn>(
    pattern: TPattern,
    handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
  ): FlowMatcher<TBase, FallthroughMatches<TMatch, TPattern>, TReturn | THandlerReturn> {
    return new FlowMatcher(flowAgainst(this.#matchObj, pattern, handler))
  }

  exhaustive(): (test: TBase) => [TMatch] extends [never] ? TReturn : NonExhaustiveError {
    return (test) => {
      type ExhaustiveReturnType = [TMatch] extends [never] ? TReturn : NonExhaustiveError
      const result = flowExhaustive(this.#matchObj)(test);
      if (isNonExhaustiveError(result)) {
        return result as ExhaustiveReturnType;
      } else {
        return (() => result) as ExhaustiveReturnType;
      }
    }
  }

  fallback<TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) {
    return flowFallback(this.#matchObj, fallbackFunction)
  }

  run() {
    return flowRun(this.#matchObj)
  }

  assertRun() {
    return flowAssertRun(this.#matchObj)
  }
}

export const flowMatch = <TTest, TReturn = never>(): FlowMatcher<TTest, TTest, TReturn> => {
  return new FlowMatcher(makeFlowMatchObject<TTest, TTest, [], TReturn>([]))
};