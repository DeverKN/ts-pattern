import { AnyArray } from "./AnyArray";

export type Shift<T extends AnyArray> = T extends [unknown, ...infer Rest]
  ? Rest
  : T extends readonly [unknown, ...infer Rest]
  ? Rest
  : never;