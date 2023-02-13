/* eslint-disable no-redeclare */
import { string } from "../old/binds"
import { MatchBind, MatchRestBind } from "../types/bind"
import { Narrow } from "../types/helpers/narrow"

type Literal = string | number | symbol
type LiteralOrTuple = Literal | Record<any, any> | LiteralOrTuple[]
// type TupleHelper<T extends (Literal | Tuple)[]> = T & {__tuple: true}
// type Tuple = TupleHelper<(Literal | TupleHelper<Tuple>)[]>
type Tuple = LiteralOrTuple[]

// const x = {x: 1}


const literal = <T extends Literal>(arg: T): T => arg
const l = literal
const tuple = <TArgs extends Tuple>(...args: TArgs): TArgs => args

// const mid = tuple("hi", "there")
// eslint-disable-next-line expect-type/expect
const hiThereDever = tuple(tuple(l("hi"), l("there")), "dever", string("test"))
//                         ^?
export {}

// eslint-disable-next-line no-unused-vars
function matchBindCreator<TLabel extends string, TMatch extends Literal>(label: TLabel, match: TMatch): MatchBind<TLabel, TMatch>;
// eslint-disable-next-line no-unused-vars
function matchBindCreator<TLabel extends string, TMatch>(label: TLabel, match: TMatch): MatchBind<TLabel, TMatch>;
function matchBindCreator<TLabel extends string, TMatch>(label: TLabel, match: TMatch): MatchBind<TLabel, TMatch> {
  const restBind: MatchRestBind<TLabel, TMatch> = {
    label,
    match,
    bindType: "matchRestBind",
  }

  return {
    label,
    match,
    bindType: "matchBind",
    [Symbol.iterator]: [restBind][Symbol.iterator],
  };
};

const testMatchBind = matchBindCreator("test", 5)

// const weirdInc = (x: {x: number | string}): {x: number} => x

// const inc = weirdInc({x: []})

const Keys = "a" as "a" | "b"

// type Obj = {
//   [Keys]: 5
// }

type Unionize<Lookup, X = { [T in keyof Lookup]: { tag: T; val: Lookup[T] } }> = X[keyof X]

type Unionize2<Lookup, X = { [T in keyof Lookup]: { [Key in T]: Lookup[T] } }> = X[keyof X]

type Test = Unionize2<{x:"a"|"b", b:"b"}>
//   ^?

// type narrowed = Narrow<unknown, string>