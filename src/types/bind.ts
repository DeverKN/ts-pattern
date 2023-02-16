import { Pattern, PatternOrPredicateBind } from "./pattern";

export type BindTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "any";

export type TypeCheckFunction<T> = (arg: unknown | T) => arg is T;

export const SymbolForBind = Symbol("bind")

export type PredicateBind<TLabel extends string, TPredicate> = {
  label: TLabel;
  [Symbol.iterator]: () => IterableIterator<PredicateRestBind<TLabel, TPredicate>>;
  predicate: TypeCheckFunction<TPredicate>;
  rest: PredicateRestBind<TLabel, TPredicate>;
  s: PredicateRestBind<TLabel, TPredicate>;
  bindType: "predicateBind";
  [SymbolForBind]: true 
};

export type PredicateRestBind<TLabel extends string, TPredicate> = {
  label: TLabel;
  predicate: TypeCheckFunction<TPredicate>;
  bindType: "predicateRestBind";
  [SymbolForBind]: true 
};

export type PredicateWildCard<TPredicate> = {
  predicate: TypeCheckFunction<TPredicate>;
  bindType: "predicateWildCard";
  [SymbolForBind]: true 
};



export type TypedBind<TType, TTypeLabel extends BindTypes, TLabel extends string> = {
  type: TType;
  typeLabel: TTypeLabel;
  label: TLabel;
  [Symbol.iterator]: () => IterableIterator<TypedRestBind<TType, TTypeLabel, TLabel>>;
  rest: TypedRestBind<TType, TTypeLabel, TLabel>;
  s: TypedRestBind<TType, TTypeLabel, TLabel>;
  bindType: "typedBind";
  [SymbolForBind]: true 
};

export type TypedRestBind<TType, TTypeLabel, TLabel extends string> = {
  type: TType;
  typeLabel: TTypeLabel;
  label: TLabel;
  bindType: "typedRestBind";
  [SymbolForBind]: true 
};

export type TypedWildCard<TType, TTypeLabel> = {
  type: TType;
  typeLabel: TTypeLabel;
  bindType: "typedWildCard";
  [SymbolForBind]: true 
};



export type MatchBind<TLabel extends string, TTest, TMatch extends Pattern<TTest> = PatternOrPredicateBind<TTest>> = {
  label: TLabel;
  [Symbol.iterator]: () => IterableIterator<MatchRestBind<TLabel, TTest, TMatch>>;
  rest: MatchRestBind<TLabel, TMatch>;
  s: MatchRestBind<TLabel, TMatch>;
  match: TMatch;
  bindType: "matchBind";
  [SymbolForBind]: true 
};

export type MatchRestBind<TLabel extends string, TTest, TMatch extends Pattern<TTest> = PatternOrPredicateBind<TTest>> = {
  label: TLabel;
  match: TMatch;
  bindType: "matchRestBind";
  [SymbolForBind]: true 
};

export type WildCard<T> = PredicateWildCard<T>
export type Bind<Label extends string, T> = PredicateBind<Label, T> | MatchBind<Label, T, PatternOrPredicateBind<T>> | WildCard<T>;

export type RestBind<Label extends string, T> = PredicateRestBind<Label, T> | MatchRestBind<Label, T, PatternOrPredicateBind<T>>;

// export type RestWildCard<T> = PredicateRestWildCard<T> | MatchRestWildCard<Label, T>;

// type AnyRestBind<TLabel extends string> = {
//   type: "any";
//   label: TLabel;
//   isRest: true;
// };

// type AnyWildCard<TLabel extends string> = {
//   type: "any";
//   label: TLabel;
// };

// export type AnyBind<TLabel extends string> = TypedBind<any, "any", TLabel>;

// export type AnyRestBind<TLabel extends string> = TypedRestBind<any, "any", TLabel>;

// export type AnyWildCard = TypedWildCard<any, "any">;

// type StringBind<TLabel extends string> = {
//   TTypeLabel: "string";
//   label: TLabel;
//   [Symbol.iterator]: () => IterableIterator<StringRestBind<TLabel>>;
// };

// type StringRestBind<TLabel extends string> = {
//   TTypeLabel: "string";
//   label: TLabel;
// };

// type StringWildCard<TLabel extends string> = {
//   TTypeLabel: "string";
//   label: TLabel;
// };

// type NumberBind<TLabel extends string> = {
//   TTypeLabel: "number";
//   label: TLabel;
//   [Symbol.iterator]: () => IterableIterator<NumberRestBind<TLabel>>;
// };

// type NumberRestBind<TLabel extends string> = {
//   TTypeLabel: "number";
//   label: TLabel;
// };

// type NumberWildCard<TLabel extends string> = {
//   TTypeLabel: "number";
//   label: TLabel;
// };

// type BooleanBind<TLabel extends string> = {
//   TTypeLabel: "boolean";
//   label: TLabel;
//   [Symbol.iterator]: () => IterableIterator<BooleanRestBind<TLabel>>;
// };

// type BooleanRestBind<TLabel extends string> = {
//   TTypeLabel: "boolean";
//   label: TLabel;
// };

// type BooleanWildCard<TLabel extends string> = {
//   TTypeLabel: "boolean";
//   label: TLabel;
// };

// const obj = {} as const

// type AssertType<T, TAssert> = T extends TAssert ? true : false;
// const testObj = { test: 2 };

// type BindObject = Record<string, any>;
// type EmptyBindObject = Record<never, never>;
// type MatchResult = [isMatch: true, binds: BindObject] | [isMatch: false, binds: EmptyBindObject];

// const testRest = [true, { test: "string" }] as [true, Record<string, any>];
// type InferRecordType<T> = T extends Record<infer K, infer V> ? [K, V] : never;
// type infered = InferRecordType<(typeof testRest)[1]>;
// type Test = AssertType<typeof testRest, MatchResult>;

// type PredicateFunc<T> = (val: T | any) => false | [typedVal: T, binds: Record<string, any>]

// export type PredicateBindV2<TLabel extends string, TPredicate> = {
//   label: TLabel;
//   [Symbol.iterator]: () => IterableIterator<PredicateRestBind<TLabel, TPredicate>>;
//   predicate: PredicateFunc<TPredicate>;
//   bindType: "predicateBind";
// };

// export type PredicateRestBindV2<TLabel extends string, TPredicate> = {
//   label: TLabel;
//   predicate: PredicateFunc<TPredicate>;
//   bindType: "predicateRestBind";
// };

// export type PredicateWildCardV2<TPredicate> = {
//   predicate: PredicateFunc<TPredicate>;
//   bindType: "predicateWildCard";
// };

// export type MatchWildCard<TMatch> = {
//   match: TMatch;
//   bindType: "matchWildCard";
// };

// export type Bind<TLabel extends string> = TypedBind<any, any, TLabel> | MatchBind<TLabel, any> | PredicateBind<TLabel, any>;
// // | AnyBind<TLabel>
// // | StringBind<TLabel>
// // | NumberBind<TLabel>
// // | BooleanBind<TLabel>

// export type RestBind<TLabel extends string> =
//   | TypedRestBind<any, any, TLabel>
//   | MatchRestBind<TLabel, any>
//   | PredicateRestBind<TLabel, any>;
// // | AnyRestBind<TLabel>
// // | StringRestBind<TLabel>
// // | NumberRestBind<TLabel>
// // | BooleanRestBind<TLabel>

// export type WildCard<TLabel extends string> =
//   | TypedWildCard<any, any>
//   // | MatchWildCard<any>
//   | PredicateWildCard<any>;
// | AnyWildCard<TLabel>
// | StringWildCard<TLabel>
// | NumberWildCard<TLabel>
// | BooleanWildCard<TLabel>

// export type StringBindOrWild = StringBind<any> | StringWildCard<any>;
// export type StringBindOrWildOrRest = StringBindOrWild | StringRestBind<any>;

// export type NumberBindOrWild = NumberBind<any> | NumberWildCard<any>;
// export type NumberBindOrWildOrRest = NumberBindOrWild | NumberRestBind<any>;

// export type BooleanBindOrWild = BooleanBind<any> | BooleanWildCard<any>;
// export type BooleanBindOrWildOrRest = BooleanBindOrWild | BooleanRestBind<any>;

// export type BindOrWild<T> = MatchBind<any, T> | PredicateBind<any, T> | PredicateWildCard<T>; //TypedBind<T, any, any> | TypedWildCard<any, any>;
// export type BindOrWildOrRest<T> = BindOrWild<T> | MatchRestBind<any, T> | PredicateRestBind<any, T>; //BindOrWild<T> | TypedRestBind<T, any, any>;

// export type AnyBindOrWild = BindOrWild<any>;
// export type AnyBindOrWildOrRest = BindOrWildOrRest<any>;

// export type Primitive = string | number | boolean;
