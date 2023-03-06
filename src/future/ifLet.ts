import { _ } from "../code/binds";
import { match } from "../code/matcher";
import { HandlerFunc } from "../code/matcherEngine";
import { PredicateBind } from "../types/bind";
import { ExtractBinds, ExtractBindsFromTagged, Unbind } from "../types/extract";
import { Pattern } from "../types/pattern";
import { InferGenericType, Tagged, UNSAFE_TagsArray } from "./taggedUnion";

export const ifLet = <
  TPattern extends Pattern<TMatch>,
  TMatch,
  TReturn,
  THandler extends HandlerFunc<TMatch, TPattern, TReturn>
>(
  pattern: TPattern,
  match: TMatch,
  handler: THandler
): TReturn | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return void 0 as any;
};

type Maybe<T> = Tagged<"Just", T> | Tagged<"None">;
const { Just, None } = UNSAFE_TagsArray<Maybe<InferGenericType>>("Just", "None");

const fetch = (url: string): Maybe<string> => Just("test");

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

  return ifLet(Just(_("i")), res, ({ i }) => {
    return `response is ${i}`
  })
};
