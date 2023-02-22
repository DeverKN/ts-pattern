import { Pop, Push } from "../types/helpers/ArrayHelpers";
import { Shift } from "../types/helpers/shift";

type ParseLiteral<T> = T extends `${infer Test extends string}`
  ? Test
  : T extends `${infer Test extends number}`
  ? Test
  : T extends `${infer Test extends boolean}`
  ? Test
  : never;

type Parse<T> = T extends `[${string}` ? [T, ExtractArray<T>, ParseArray<ExtractArray<T>>] : ParseLiteral<T>;

type ExtractArrayHelper<T, Depth extends unknown[] = [unknown]> = Depth extends never[]
  ? ""
  : T extends `[${infer ArrayBody}`
  ? `[${ExtractArrayHelper<ArrayBody, Push<Depth, unknown>>}`
  : T extends `${infer ArrayBody}]${infer Stuff}`
  ? `${ArrayBody}]${ExtractArrayHelper<Stuff, Shift<Depth>>}`
  : "Finale";

type ExtractArrayHelper2<T, Depth extends unknown[] = [unknown]> = Depth extends never[]
  ? ""
  : T extends `[${infer ArrayBody}`
  ? `[${ExtractArrayHelper2<ArrayBody, Push<Depth, unknown>>}`
  : T extends `${infer First},${infer Rest}`
  ? ContainsEnd<First> extends true
    ? T extends `${infer ArrayBody}]${infer Stuff}`
      ? `${ArrayBody}]${ExtractArrayHelper2<Stuff, Shift<Depth>>}`
      : never
    : `${First},${ExtractArrayHelper2<Rest, Depth>}`
  : T extends `${infer ArrayBody}]${infer Stuff}`
  ? `${ArrayBody}]${ExtractArrayHelper2<Stuff, Shift<Depth>>}`
  : never;

type ContainsEnd<T> = T extends `${string}]${string}` ? true : false;

type ExtractArray<T> = T extends `[${infer ArrayBody}` ? `[${ExtractArrayHelper2<ArrayBody>}` : never;

// type Extracted = ExtractArray<`[[1,2,4],2],5,6,7]`>;

type Test = `[1,2,[3,4],[5,[6]]]`;

type Extracted2 = ExtractArray<Test>;

// type Extracted3 = ExtractArray<`[3,4],6],[5,[6]]]`>;

type Parsed = Parse<Test>;

// type InnerParsed = Parse<Test>;
/*
1
2     
[3,4] 
    3
    4
5
*/

type Tested = ParseArray<"1,2,[3,4]]">;

type SplitArray<T> = T extends `${infer First},${infer Rest}`
  ? [T extends `[${string}` ? Parse<First> : First, ...SplitArray<Rest>]
  : T extends `${infer First}]`
  ? [T extends `[${string}` ? Parse<First> : First]
  : [];

type ParseArray<T> = T extends `[${infer First}`
  ? T extends `${ExtractArray<First>}${infer Rest}`
    ? [Parse<ExtractArray<First>>, ...ParseArray<Rest>]
    : [T, ExtractArray<First>]
  : T extends `${infer First},${infer Rest}`
  ? [Parse<First>, ...ParseArray<Rest>]
  : T extends `${infer First}]`
  ? [Parse<First>]
  : [];
