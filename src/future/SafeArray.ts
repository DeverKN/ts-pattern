import { literal } from "../code/literal";
import { KVObject } from "../types/helpers/KVObject";
import { MergeObjects } from "../types/helpers/MergeObjects";
import { ReadonlyArrayToNormal } from "../types/helpers/unreadonly";
import { OpaqueType } from "./OpaqueTypes";
import { Tagged } from "./taggedUnion";

type Push<TArr extends unknown[], T> = [...TArr, T];

type Pop<TArr extends unknown[]> = TArr extends [...infer Rest, infer Last] ? Rest : [];

const push = <TArr extends unknown[], T>(arr: TArr, el: T): [...TArr, T] => {
  return [...arr, el];
};

// type Concat<TOne extends unknown[], TTwo extends unknown[]> = [...TOne, ...TTwo];
// const concat = <TOne extends unknown[], TTwo extends unknown[]>(one: TOne, two: TTwo): Concat<TOne, TTwo> => {
//   return [...one, ...two];
// };

// const test: [] = [];
// const test2 = push(test, 5);

type ArrayOfLengthInternal<T, X extends number> = T[] & { length: X };

// type ArrayOfLengthHelper<T, ArrTemplate> = unknown//ArrayOfLengthHelper<>

type ArrayOfLength<T, X extends number> = T[] & { length: X };
type MapArrayOfLength<Template> = Template extends [infer First, ...infer Rest]
  ? [First, ...MapArrayOfLength<Rest>]
  : [];
type ArrayOfLengthOrGreater<T, X extends number> = MapArrayOfLength<ArrayOfLength<T, X>>; //, ...T[]]

const slice = <TArr extends unknown[], TIndex extends LessThanOrEqualTo<Length<TArr>>>(
  arr: TArr,
  index: TIndex
): TArr => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return arr.slice(0, index) as any;
};

// type CheckLength<TArr extends unknown[]>

// type

// const fiveNumbers: ArrayOfLengthInternal<number, 5> = [1,2,3,4,5] as [1,2,3,4,5]

type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

type FiveNumberArray = MapArrayOfLength<ArrayOfLength<number, 5>>;

const SizedArray = <TArr extends unknown[]>(...args: TArr): TArr => args;
const sliced = slice(SizedArray(1, 2, 3, 4), 3);

type Length<T extends unknown[]> = T["length"];
// type Zero = []
// type One = Push<Zero, unknown>
// type Two = Push<One, unknown>
// type SafeNumber = Zero | Push<SafeNumber, unknown>

type Leaf = string;
// type Node = { left: Tree, right: Tree }
type Tree = Leaf | { left: Tree; right: Tree };

type UnknownArrayOfLength<N extends number> = Tuple<unknown, N>;
type Increment<N extends number> = Length<Push<UnknownArrayOfLength<N>, unknown>>;
type Decrement<N extends number> = Length<Pop<UnknownArrayOfLength<N>>>;

type Zero = Length<[]>;
type One = Increment<Zero>;
type Four = 4;
type Five = Increment<Four>;
type Three = Decrement<Four>;

type IsGreaterThanOrEqual<T extends number, U extends number> = T extends 0
  ? U extends 0
    ? true
    : false
  : U extends 0
  ? true
  : IsGreaterThanOrEqual<Decrement<T>, Decrement<U>>;

type IsGreaterThan<T extends number, U extends number> = T extends 0
  ? U extends 0
    ? false
    : false
  : U extends 0
  ? true
  : IsGreaterThanOrEqual<Decrement<T>, Decrement<U>>;

type True = IsGreaterThanOrEqual<Five, Three>;
type Add<T, U extends number> = T extends number ? (U extends 0 ? T : Add<Increment<T>, Decrement<U>>) : never;
const add = <T extends number, U extends number>(t: T, u: U): Add<T, U> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (t + u) as any;
};

type Subtract<T, U extends number> = T extends number
  ? U extends 0
    ? T
    : Subtract<Decrement<T>, Decrement<U>>
  : never;
type Equals<T extends number, U extends number> = T extends U ? (U extends T ? true : false) : false;

type Eight = Add<Five, Three>;
type Two = Subtract<Five, Three>;
type True2 = Equals<Five, Add<Three, Two>>;

type False = Equals<Five, Three>;
type False2 = Equals<Five, number>;

type LessThanHelper<X extends number> = X extends 0 ? 0 : X | LessThanHelper<Decrement<X>>;
type LessThan<X extends number> = X extends 0 ? never : LessThanHelper<Decrement<X>>;
type LessThanOrEqualTo<X extends number> = X | LessThan<X>;

type GreaterThanHelper<X, IncrementNum extends number> = X extends number
  ? IncrementNum extends 0
    ? never
    : X | GreaterThanHelper<Increment<X>, Decrement<IncrementNum>>
  : never;
type GreaterThan<X extends number> = GreaterThanHelper<Increment<X>, 10>;

type LessThanFive = LessThan<5>;

// type LessThanNinetyNine = LessThan<99>

type DependentTypeError<T extends string> = {
  __errorMsg: T;
};

type DivideHelper<T extends number, U extends number> = T extends 0
  ? 0
  : IsGreaterThan<U, T> extends true
  ? 1
  : Increment<DivideHelper<Subtract<T, U>, U>>;

type Divide<T extends number, U extends number> = U extends 0
  ? DependentTypeError<"Cannot Divide By Zero">
  : DivideHelper<T, U>;

type Multiply<T extends number, U extends number> = U extends 0 ? 0 : Add<T, Multiply<T, Decrement<U>>>;

type Ten = Add<Eight, Two>;
type Two2 = Divide<Ten, Two>;

type Sixteen = Multiply<Eight, Two>;
type OneHundredSix = Multiply<53, 2>;

type Sum<T extends number[]> = T extends []
  ? 0
  : T extends [infer First, ...infer Rest extends number[]]
  ? Add<First, Sum<Rest>>
  : never;

type ThirtyTwo = Sum<[10, 9, 13]>;

const test = (num: LessThan<3>) => {
  const added = add(num, 2);
  const arrOne = SizedArray(1, 2, 3);
  const arrTwo = SizedArray(1, 2, 3, 4);
  const arrThree = SizedArray(1, 2, 3, 4, 5);
  const arrFour = SizedArray(1, 2, 3, 4, 5, 6, 7);
  const testIndexOne = arrOne[added];
  const testIndexTwo = arrTwo[added];
  const testIndexThree = arrThree[added];
  const testIndexFour = arrFour[added];
};

type ConsList<T> = null | [T, ConsList<T>];

// type SortedList<T extends number, U extends number> = IsGreaterThanOrEqual<U, T> extends true ? [T, SortedList<T>] : null

type SortedList<T extends number> = null | [T, SortedList<GreaterThan<T>>];
// type SortedList<T extends number> = <U extends number>(arg: U) => IsGreaterThanOrEqual<U, T> extends true ? SortedList<U> : null
// const SortedList = <T extends number>(arg: T): SortedList<T> => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   return void 0 as any
// }

// const sorted = SortedList(0)(1)(2)(3)(4)(5)(6)(4)
const SortedList = <T extends number>(el: T, cons: SortedList<GreaterThan<T>>): SortedList<T> => {
  return [el, cons];
};

const s = SortedList;

const sorted = s(2, s(3, s(5, null)));
export {};

type NatZero = [];
type NaturalNumberHelper<
  N extends number,
  R extends unknown[],
  Counter extends unknown[] = []
> = Counter["length"] extends N ? R : R | NaturalNumberHelper<N, [...R, unknown], Push<Counter, unknown>>;

type NaturalNumbers<N extends number, StartingNum extends unknown[] = NatZero> = NaturalNumberHelper<N, StartingNum>;

type Nats = NaturalNumbers<5>;
type ExtendedNats = NaturalNumbers<48, [[], []]>;
// type NatNumbers = Length<Nats>
type ExtendedNatNumbers = Length<ExtendedNats>;

// type SortedList2<
//   T extends LessThan<NextNum>,
//   U extends SortedList2<any, any, any> | [null] = [null],
//   NextNum extends number = U extends SortedList2<infer Next, any, number> ? Next : 0
// > = [T, U];

// // const testSortedList: SortedList2<1,So,any> = [1,2,3,4,3];

// const isSorted = <T extends SortedList2<any, any, any>>(arg: T): T => arg

// // eslint-disable-next-line @typescript-eslint/no-unsafe-return
// const Unreadonly = <T extends readonly unknown[]>(arg: T): ReadonlyArrayToNormal<T> => arg as any
// const testSortedList = isSorted(Unreadonly([1,[2,[3,null]]] as const))

const SymbolForKeyType = Symbol("KeyType");
type SymbolForKeyType = typeof SymbolForKeyType;
const SymbolForValueType = Symbol("ValueType");
type SymbolForValueType = typeof SymbolForValueType;
type SafeRecord<K extends PropertyKey, V> = {
  [SymbolForKeyType]: K;
  [SymbolForValueType]: V;
};

type DefineKey<
  TRecord extends SafeRecord<PropertyKey, unknown>,
  K extends TRecord[SymbolForKeyType],
  V extends TRecord[SymbolForValueType]
> = MergeObjects<TRecord, KVObject<K, V>>;

const set = <
  TRecord extends SafeRecord<PropertyKey, unknown>,
  K extends TRecord[SymbolForKeyType],
  V extends TRecord[SymbolForValueType]
>(
  record: TRecord,
  k: K,
  v: V
): DefineKey<TRecord, K, V> => {
  const result = {
    ...record,
    [k]: v,
  };
  return result as DefineKey<TRecord, K, V>;
};

const SafeRecord = <K extends PropertyKey, V>(): SafeRecord<K, V> => {
  const record = {
    [SymbolForKeyType]: null,
    [SymbolForValueType]: null,
  };
  return record as unknown as SafeRecord<K, V>;
};

const langs = SafeRecord<string | number, string>();
const l = literal;
const langs2 = set(langs, "JS", l("cool"));
const langs3 = set(langs2, "TS", l("cooler"));
const langs4 = set(langs3, "Purescript", l("coolest"));
const langs5 = set(langs4, "Scratch", l("god tier"));
const langs6 = set(langs5, 2, l("bruh what"));

const getMsg = <LangName extends keyof typeof langs6>(langName: LangName): typeof langs6[LangName] => {
  return langs6[langName];
};

const get =
  <Dict extends SafeRecord<PropertyKey, unknown>>(dict: Dict) =>
  <K extends keyof Dict>(k: K): Dict[K] =>
    dict[k];

const getMsg2 = get(langs6);

const msg1 = getMsg("JS");

type StringContains<S, SubStr extends string> = S extends `${string}${SubStr}${string}` ? true : false;

type TrueStr = StringContains<"My name is Dever", "Dever">;
type FalseStr = StringContains<"My name is Dever", "Sydney">;

const findIndex = <SubS extends string>(s: StringContaining<string, SubS>, subS: SubS) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return s.indexOf(subS);
};

// type StringContaining<S, SubStr extends string> = string & { base: S; sub: SubStr; tag: "__string_contains__" };

type StringContaining<S, SubStr extends string> = OpaqueType<S, "string_containing", SubStr>;

type AssertStringContains<S, SubStr> = SubStr extends string
  ? StringContains<S, SubStr> extends true
    ? StringContaining<S, SubStr>
    : unknown
  : unknown;

interface Assertions<A, B> {
  contains: AssertStringContains<A, B>;
}

type URIs = keyof Assertions<unknown, unknown>;
const assert =
  <URI extends URIs>() =>
  <A, B>(a: A, b: B): Assertions<A, B>[URI] => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return a as any;
  };

const assertContains =
  <SubStr extends string>(sub: SubStr) =>
  <S extends string>(s: S): StringContains<S, SubStr> extends true ? StringContaining<S, SubStr> : unknown => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return s as any;
  };

type InvariantError<Msg> = {
  ErrorMsg: Msg;
};

type Invariant<
  InvariantExpression extends boolean,
  Result,
  ErrorMsg extends string = "Invariant violated"
> = InvariantExpression extends true ? Result : InvariantError<ErrorMsg>;

const wrapInvariant = <Cond extends boolean, T, Msg extends string>(t: T) => t as Invariant<Cond, T, Msg>;

const findIndex2 = <S extends string, SubS extends string>(
  s: S,
  subS: SubS
): Invariant<StringContains<S, SubS>, number, "String does not contain target substring"> => {
  return wrapInvariant(s.indexOf(subS));
};

// const lookupKeys = ()

// const none: never = {};
const index = findIndex2("My name is Dever", "Sydney");

type NumberStr = `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9`;
type Letter =
  | `a`
  | `b`
  | `c`
  | `d`
  | `e`
  | `f`
  | `g`
  | `h`
  | `i`
  | `j`
  | `k`
  | `l`
  | `m`
  | `n`
  | `o`
  | `p`
  | `q`
  | `r`
  | `s`
  | `t`
  | `u`
  | `v`
  | `w`
  | `x`
  | `y`
  | `z`;
// type CountryCode = `1` | `353`;
// type Opt<S extends string> = S | "";
type Char = NumberStr | Letter;
type Len<S extends string> = S extends ""
  ? 0
  : S extends `${Char}${infer Rest extends string}`
  ? Increment<Len<Rest>>
  : 0;

// type LenTest = Len<"abc">
// type PhoneNumber =
//   `${PhoneNumberDigit}${PhoneNumberDigit}${PhoneNumberDigit}-${PhoneNumberDigit}${PhoneNumberDigit}${PhoneNumberDigit}${PhoneNumberDigit}`;

type StringOfLength<X extends number> = OpaqueType<string, "StringOfLength", X>;
type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`;
type Concated = Concat<"Hello", " there">;
type TenLetterString = StringOfLength<10>;
type Concated2 = Concat<TenLetterString, " there">;
type ContainsTest = StringContains<Concat<string, " there">, "maybe">;
type Head<S extends string, X extends number> = X extends 0
  ? ""
  : S extends `${infer First extends Char}${infer Rest extends string}`
  ? `${First}${Head<Rest, Decrement<X>>}`
  : string;

type Is<T, U> = T extends U ? (U extends T ? true : false) : false;

// type Test5 = Is<string, Char>
type Hello = Head<`Hello there`, 5>;
type Hello2 = Head<Concat<"test", `Hello there`>, 5>;
type Hello3 = Head<Concat<string, `Hello there`>, 5>;