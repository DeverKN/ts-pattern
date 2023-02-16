import { PredicateBind, PredicateRestBind, BindTypes, MatchBind, MatchRestBind, TypeCheckFunction, PredicateWildCard, SymbolForBind } from "../types/bind";
import { Resolve } from "../types/resolve";

type PredicateFactory<TPredicate> = <Label extends string>(label: Label) => PredicateBind<Label, TPredicate>;
export const makePredicateBindFactory = <TPredicate>(
  predicateFunc: TypeCheckFunction<TPredicate>
): PredicateFactory<TPredicate> => {
  return <Label extends string>(label: Label) => {
    const restBind: PredicateRestBind<Label, TPredicate> = {
      label,
      predicate: predicateFunc,
      bindType: "predicateRestBind",
      [SymbolForBind]: true
    };

    return {
      label,
      predicate: predicateFunc,
      bindType: "predicateBind",
      [Symbol.iterator]: [restBind][Symbol.iterator],
      rest: restBind,
      s: restBind,
      [SymbolForBind]: true
    };
  };
};

type PredicateFactoryAndWildCard<TPredicate> = PredicateWildCard<TPredicate> & PredicateFactory<TPredicate>
export const makePredicateBindFactoryAndWildcard = <TPredicate>(
  predicateFunc: TypeCheckFunction<TPredicate>
): PredicateFactoryAndWildCard<TPredicate> => {
  const wildCard: PredicateWildCard<TPredicate> = {
    predicate: predicateFunc,
    bindType: "predicateWildCard",
    [SymbolForBind]: true
  }

  const predicateFactory = makePredicateBindFactory(predicateFunc)

  return Object.assign(predicateFactory, wildCard)
}

const typeCheckFunc = <T>(type: BindTypes) => (val: unknown): val is T => type === "any" || typeof val === type;
export const makeTypeBindFactory = <T>(type: BindTypes) => makePredicateBindFactoryAndWildcard<T>(typeCheckFunc<T>(type));

// type MatchBindFactory =
export const matchBindCreator = <TLabel extends string, TMatch>(label: TLabel, match: TMatch): MatchBind<TLabel, Resolve<TMatch>> => {
  const restBind = {
    label,
    match,
    bindType: "matchRestBind",
    [SymbolForBind]: true
  } as MatchRestBind<TLabel, Resolve<TMatch>>;

  return {
    label,
    match,
    bindType: "matchBind",
    [Symbol.iterator]: [restBind][Symbol.iterator],
    rest: restBind,
    s: restBind,
    [SymbolForBind]: true
  } as MatchBind<TLabel, Resolve<TMatch>>;
};

export const number = makeTypeBindFactory<number>("number");
export const string = makeTypeBindFactory<string>("string");
export const is = matchBindCreator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ = makeTypeBindFactory<any>("any");
// const _: PredicateFactory<any> = Object.assign(anyFactory(), anyFactory)