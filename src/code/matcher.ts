import { NonExhaustiveError } from "../types/helpers/AssertNever";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/spec";
import { _ } from "./binds";
import { literal } from "./literal";
import * as matchFuncs from "./match";
import { HandlerFunc } from "./matcherEngine";

export type Matcher<TMatch, TReturn> = {
  against: <TPattern extends Pattern<TMatch>, THandlerReturn>(
    pattern: TPattern,
    handler: HandlerFunc<TMatch, TPattern, THandlerReturn>
  ) => Matcher<FallthroughMatches<TMatch, TPattern>, TReturn | THandlerReturn>;
  exhaustive: [TMatch] extends [never] ? () => TReturn : NonExhaustiveError;
  fallback: <TMatch, TFallbackReturn>(fallbackFunction: (val: TMatch) => TFallbackReturn) => TReturn | TFallbackReturn;
  run: () => TReturn;
};

const match = <TTest>(test: TTest): Matcher<TTest, never> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return void 0 as any;
};

const test = match({ x: literal(1), y: literal(2) })
            .against({ x: _("x"), y: 2 }, ({ x }) => {
              return x;
            })
            .exhaustive();
