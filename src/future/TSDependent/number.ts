import { Not } from "./helpers/boolean";

/*
For some reason these cannot be imported or stuff breaks
*/
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type Push<TArr extends unknown[], T> = [...TArr, T];

export type Pop<TArr extends unknown[]> = TArr extends [...infer Rest extends unknown[], unknown] ? Rest : [];

export type Length<Arr extends unknown[]> = Arr["length"]
/*
End weird not import
*/

type UnknownArrayOfLength<N extends number> = Tuple<unknown, N>;
export type Increment<N extends number> = Length<Push<UnknownArrayOfLength<N>, unknown>>;
export type Decrement<N extends number> = Length<Pop<UnknownArrayOfLength<N>>>;
export type Add<T, U extends number> = T extends number ? (U extends 0 ? T : Add<Increment<T>, Decrement<U>>) : never;

export type Subtract<T, U extends number> = T extends number
  ? U extends 0
    ? T
    : Subtract<Decrement<T>, Decrement<U>>
  : never;

export type Equals<T extends number, U extends number> = T extends U ? (U extends T ? true : false) : false;

export type IsGreaterThanOrEqual<X extends number, Y extends number> = X extends Y
  ? true
  : X extends 0
  ? false
  : IsGreaterThanOrEqual<Decrement<X>, Y>;
export type IsGreaterThan<X extends number, Y extends number> = X extends Y ? false : IsGreaterThanOrEqual<X, Y>;
export type IsLessThanOrEqual<X extends number, Y extends number> = Not<IsGreaterThan<X, Y>>;
export type IsLessThan<X extends number, Y extends number> = X extends Y ? false : IsLessThanOrEqual<X, Y>;

type DivideHelper<T extends number, U extends number> = T extends 0
  ? 0
  : IsGreaterThan<U, T> extends true
  ? 1
  : Increment<DivideHelper<Subtract<T, U>, U>>;

export type Divide<T extends number, U extends number> = DivideHelper<T, U>;

export type Multiply<T extends number, U extends number> = U extends 0 ? 0 : Add<T, Multiply<T, Decrement<U>>>

export type LessThanHelper<X extends number> = X extends 0 ? 0 : X | LessThanHelper<Decrement<X>>
export type LessThan<X extends number> = X extends 0 ? never : LessThanHelper<Decrement<X>>

// type Nums = LessThan<45>
const GreaterThan = <X extends number, Y extends number>(x: X, y: Y): y is LessThan<X> => {
  return x < y
}

const LessThan = <X extends number, Y extends number>(x: X, y: Y): x is LessThan<Y> => {
  return x < y
}

const lookupArr = ["a","b","c"] as const

const add = <X extends number, Y extends number>(x: X, y: Y): Add<X, Y> => x + y as Add<X, Y>
const sub = <X extends number, Y extends number>(x: X, y: Y): Subtract<X, Y> => x + y as Subtract<X, Y>

const lookup = (num: number) => {
  const length = lookupArr.length
  if (LessThan(num, length)) {
    return lookupArr[num]
  } else {
    return "oops!"
  }
}