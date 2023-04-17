import { _ } from "../code/binds";
import { match } from "../code/matcher";
import { HandlerFunc, matchBase } from "../code/matcherEngine";
import { ExtractBinds } from "../types/extract";
import { IsAny } from "../types/helpers/narrow";
import { FallthroughMatches } from "../types/matcher";
import { Pattern } from "../types/pattern";
import { InferGenericType, Tagged, UNSAFE_TagsArray } from "./taggedUnion";

export const ifLet = <
  TPattern extends Pattern<TMatch>,
  TMatch,
  THandler extends HandlerFunc<TMatch, TPattern, unknown>
>(
  pattern: TPattern,
  match: TMatch,
  handler: THandler
): ReturnType<THandler> | undefined => {
  const [isMatch, binds] = matchBase(match, pattern);
  if (isMatch) {
    return handler(binds as ExtractBinds<TMatch, TPattern>) as ReturnType<THandler>;
  } else {
    return undefined;
  }
};

export const ifLetElse = <
  TPattern extends Pattern<TMatch>,
  TMatch,
  THandler extends HandlerFunc<TMatch, TPattern, unknown>,
  TElse
>(
  pattern: TPattern,
  match: TMatch,
  handler: THandler,
  elseVal: (val: FallthroughMatches<TMatch, TPattern>) => TElse
): ReturnType<THandler> | TElse => {
  const [isMatch, binds] = matchBase(match, pattern);
  if (isMatch) {
    return handler(binds as ExtractBinds<TMatch, TPattern>) as ReturnType<THandler>;
  } else {
    return elseVal(match as FallthroughMatches<TMatch, TPattern>);
  }
};

export const whileLet = <
  TPattern extends Pattern<TMatch>,
  TMatch,
  THandler extends HandlerFunc<TMatch, TPattern, void>
>(
  pattern: TPattern,
  match: () => TMatch,
  handler: THandler
): void => {
  let matchInstance = match();
  let [isMatch, binds] = matchBase(matchInstance, pattern);
  while (isMatch) {
    matchInstance = match();
    handler(binds as ExtractBinds<TMatch, TPattern>);
    [isMatch, binds] = matchBase(matchInstance, pattern);
  }
};

export const recLet = <
  TPattern extends Pattern<TMatch>,
  TMatch,
  TReturn,
  THandler extends HandlerFunc<TMatch, TPattern, TMatch>
>(
  pattern: TPattern,
  match: TMatch,
  handler: THandler
): FallthroughMatches<TMatch, TPattern> => {
  const [isMatch, binds] = matchBase(match, pattern);
  if (isMatch) {
    const newMatch = handler(binds as ExtractBinds<TMatch, TPattern>);
    return recLet(pattern, newMatch, handler);
  } else {
    return match as FallthroughMatches<TMatch, TPattern>; // | TReturn
  }
};

type Option<T> = Tagged<"Some", T> | Tagged<"None">;
const { Some, None } = UNSAFE_TagsArray<Option<InferGenericType>>("Some", "None");

const fetch = (url: string): Option<string> => Some("test");

// type Binds = ExtractBinds<Maybe<string>, Tagged<"Just", PredicateBind<"i", any>>>
// type Binds2 = ExtractBinds<string, PredicateBind<"i", any>>
// type Binds3 = ExtractBinds<Tagged<"Just", string>, Tagged<"Just", PredicateBind<"i", any>>>
// type Binds4 = Unbind<ExtractBindsFromTagged<Maybe<string>, Tagged<"Just", PredicateBind<"i", any>>>>
// type ExtractedInstance = Extract<Maybe<string>, Tagged<"Just", unknown>>

const load = () => {
  const res = fetch("/imgs/test/duckroll.png");
  // return match(res)
  //   .against(Just(_("i")), ({ i }) => i)
  //   .against(None(), () => "fall")
  //   .exhaustive();

  return ifLet(Some(_("i")), res, ({ i }) => {
    return `response is ${i}`;
  });
};

const whileRec = (cond: () => boolean, then: () => void): void => {
  if (!cond()) return;
  then();
  return whileRec(cond, then);
};

const main = () => {
  let optional = Some(0) as Option<number>;

  // This reads: "while `let` destructures `optional` into
  // `Some(i)`, evaluate the block `(({ i }) => { ... })`. Else `break`.
  whileLet(Some(_("i")), () => optional, ({ i }) => {
      if (i > 9) {
        console.log("Greater than 9, quit!");
        optional = None();
      } else {
        console.log(`'i' is ${i}. Try again.`);
        optional = Some(i + 1);
      }
      // ^ Less rightward drift and doesn't require
      // explicitly handling the failing case.
    }
  );

  return recLet(Some(_("i")), optional, ({ i }) => {
    if (i > 9) {
      console.log("Greater than 9, quit!");
      return None();
    } else {
      console.log(`'i' is ${i}. Try again.`);
      return Some(i + 1);
    }
    // ^ Less rightward drift and doesn't require
    // explicitly handling the failing case.
  });
};

type IsAnyArray<T extends unknown[]> = T extends (infer TArr)[] ? IsAny<TArr> : false;
type IsGeneric<T> = T extends never ? true : false;

const head = <T>(list: T[]): T | null => {
  // ifLet([_("head"), _("rest").rest], list, ({ head }) => head)
  // return []
  // const [ first, ...rest ] = list
  // type TestPattern = Pattern<T[]>;
  // type TestArrayPattern = ArrayPattern<T[]>;
  // type TestArrayHelperPattern = ArrayPatternHelper<T[]>;
  // const test: TestPattern = [_("head"), _("rest").rest];
  // // type True = IsGeneric<IsAnyArray<T[]>>

  return match(list)
    .against([_("first"), _("rest").s], ({ first, rest }) => first)
    .against([], () => null)
    .exhaustive();
};

const unwrap = <T>(option: Option<T>): T => {
  return ifLetElse(
    Some(_("val")),
    option,
    ({ val }) => {
      return val;
    },
    () => {
      throw Error(`Attemped to unwrap a "None" value`);
    }
  );
  // return match(option)
  //   .against(Some(_("val")), ({ val }) => val)
  //   .against(None(), () => {
  //     throw Error(`Attemped to unwrap a "None" value`);
  //   })
  //   .exhaustive();
};

// const test = (arg: []) => {
//   return match(arg)
//     .against(_("i"), ({ i }) => i)
//     .exhaustive();
// };
