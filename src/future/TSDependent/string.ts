import { Decrement, Increment } from "./number";

type NumberStr = `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9`;
type CharSymbols = " " | `'` | `"` | "`" | ">" | "<"
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

type Char = NumberStr | CharSymbols | Letter | Uppercase<Letter>;
export type StartsWith<S extends string, Prefix extends string> = S extends `${Prefix}${string}` ? true : false;
export type EndsWith<S extends string, Suffix extends string> = S extends `${string}${Suffix}` ? true : false;
export type StringContains<S, SubString extends string> = S extends `${string}${SubString}${string}` ? true : false;

export type Prefix<S extends string, X extends number> = X extends 0
  ? ""
  : S extends `${infer First extends Char}${infer Rest extends string}`
  ? `${First}${Prefix<Rest, Decrement<X>>}`
  : string;

// export type Suffix<S extends string, X extends number> = Prefix<>

// type Test = "New test" extends `${infer Start extends string}${infer Last extends "t"}` ? Start : false//Suffix<"New test", 4>
export type Len<S extends string> = S extends ""
  ? 0
  : S extends `${Char}${infer Rest extends string}`
  ? Increment<Len<Rest>>
  : 0;
