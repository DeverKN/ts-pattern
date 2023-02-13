import { PredicateBind, PredicateRestBind, BindTypes, MatchBind, MatchRestBind, TypeCheckFunction } from "../types/bind";

type PredicateFactory<TPredicate> = <Label extends string>(label: Label) => PredicateBind<Label, TPredicate>;
export const makePredicateBindFactory = <TPredicate>(
  predicateFunc: TypeCheckFunction<TPredicate>
): PredicateFactory<TPredicate> => {
  return <Label extends string>(label: Label) => {
    const restBind: PredicateRestBind<Label, TPredicate> = {
      label,
      predicate: predicateFunc,
      bindType: "predicateRestBind",
    };

    return {
      label,
      predicate: predicateFunc,
      bindType: "predicateBind",
      [Symbol.iterator]: [restBind][Symbol.iterator],
      rest: restBind,
      s: restBind
    };
  };
};

export const makeTypeBindFactory = <T>(type: BindTypes) => {
  const typeCheckFunc = (val: unknown): val is T => type === "any" || typeof val === type;
  return makePredicateBindFactory<T>(typeCheckFunc);
};

// type MatchBindFactory =
export const matchBindCreator = <TLabel extends string, TMatch>(label: TLabel, match: TMatch): MatchBind<TLabel, TMatch> => {
  const restBind: MatchRestBind<TLabel, TMatch> = {
    label,
    match,
    bindType: "matchRestBind",
  };

  return {
    label,
    match,
    bindType: "matchBind",
    [Symbol.iterator]: [restBind][Symbol.iterator],
    rest: restBind,
    s: restBind
  };
};

export const number = makeTypeBindFactory<number>("number");
export const string = makeTypeBindFactory<string>("string");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ = makeTypeBindFactory<any>("any");