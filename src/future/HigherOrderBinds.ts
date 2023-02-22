import { makePredicateBind } from "../code/binds";
import { PredicateBind, TypeCheckFunction } from "../types/bind";
import { ArrayVals } from "../types/helpers/ArrayVals";
import { UnionToIntersection } from "../types/helpers/UNSAFE_UnionToIntersection";

export const Union = <TLabel extends string, TBind extends PredicateBind<string, unknown>[], TBinds = ArrayVals<TBind>, PredicateTypes = TBinds extends PredicateBind<string, infer BindType> ? BindType : never>(label: TLabel, ...binds: TBind): PredicateBind<TLabel, PredicateTypes> => {
  const mappedPredicates = binds.map(({predicate}) => predicate)
  const mergedPredicates: TypeCheckFunction<PredicateTypes> = ((test: unknown) => mappedPredicates.some((predicate) => predicate(test))) as unknown as TypeCheckFunction<PredicateTypes>
  return makePredicateBind(label, mergedPredicates)
};

export const Intersection = <TLabel extends string, TBind extends PredicateBind<string, unknown>[], TBinds = ArrayVals<TBind>, PredicateTypesHelper = TBinds extends PredicateBind<string, infer BindType> ? BindType : never, PredicateTypes = UnionToIntersection<PredicateTypesHelper>>(label: TLabel, ...binds: TBind): PredicateBind<TLabel, PredicateTypes> => {
  const mappedPredicates = binds.map(({predicate}) => predicate)
  const mergedPredicates: TypeCheckFunction<PredicateTypes> = ((test: unknown) => mappedPredicates.every((predicate) => predicate(test))) as unknown as TypeCheckFunction<PredicateTypes>
  return makePredicateBind(label, mergedPredicates)
};