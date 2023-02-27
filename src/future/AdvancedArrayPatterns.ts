import { RestBind } from "../types/bind";
import { AnyArray } from "../types/helpers/AnyArray";
import { ArrayVals } from "../types/helpers/ArrayVals";
import { Pattern } from "../types/pattern";

// type ListPattern<T extends any[]> = T extends (infer TArr)[] ? (Pattern<TArr>)[] : never
// type ListPatternWithStartRest<T extends any[]> = T extends (infer TArr)[] ? [RestBind<string, TArr>, ...(Pattern<TArr>)[]] : never
// type ListPatternWithEndRest<T extends any[]> = T extends (infer TArr)[] ? [...(Pattern<TArr>)[], RestBind<string, TArr>] : never

type ListPatternRestStart<T> = [RestBind<string, T>, ...ListPatternNoRest<T>]
type ListPatternRestEnd<T> = [...ListPatternNoRest<T>, RestBind<string, T>];
type ListPatternNoRest<T> = Pattern<T>[];

export type AdvancedArrayPattern<T extends AnyArray> = T extends never[]
  ? []
  : T extends [infer First, ...infer Rest]
  ? [RestBind<string, ArrayVals<T>>, ...ListPatternNoRest<ArrayVals<T>>] | [Pattern<First>, ...AdvancedArrayPatternHelper<Rest>]
  : T extends (infer TArr)[]
  ? Pattern<TArr>[] | ListPatternRestEnd<TArr> | ListPatternRestStart<TArr>
  : never;

type AdvancedArrayPatternHelper<T extends AnyArray> = T extends [infer First, ...infer Rest]
  ? [RestBind<string, ArrayVals<T>>] | [Pattern<First>, ...AdvancedArrayPattern<Rest>]
  : T extends (infer TArr)[]
  ? Pattern<TArr>[] | ListPatternRestEnd<TArr>
  : never;

// type AdvancedArrayPatternHelperNoRest<T extends AnyArray> = T extends [infer First, ...infer Rest]
//   ? [Pattern<First>, ...AdvancedArrayPatternHelperNoRest<Rest>]
//   : T extends unknown[]
//   ? ["List"]
//   : never;

type Test1 = AdvancedArrayPattern<[number, ...number[]]>;

/*

OK = [number, number]
OK = [number, RestBind<number>]
OK = [PredicateBind<number>, RestBind<number>]
OK = [PredicateBind<number>, number]
OK = [PredicateBind<number>]
OK = [RestBind<number>]

NOT OK = []

*/

type Test2 = AdvancedArrayPattern<number[]>;
/*

OK = [number, number]
OK = [number, RestBind<number>]
OK = [PredicateBind<number>, RestBind<number>]
OK = [PredicateBind<number>, number]
OK = [PredicateBind<number>]
OK = [RestBind<number>]

STILL OK = []

*/

type Test3 = AdvancedArrayPattern<[number, number, ...number[]]>;
/*

OK = [number, number]
OK = [number, RestBind<number>]
OK = [PredicateBind<number>, RestBind<number>]
OK = [PredicateBind<number>, number]
OK = [PredicateBind<number>, PredicateBind<number>]
OK = [RestBind<number>]
OK = [number, RestBind<number>]

NOT OK = []
NOT OK = [PredicateBind<number>]
NOT OK = [number]

*/

type Assert<T, U> = T extends U ? true : false;
type Test4 = Assert<[number, RestBind<string, number>], AdvancedArrayPattern<[number, number, ...number[]]>>;

type Test5 = AdvancedArrayPattern<[]>;