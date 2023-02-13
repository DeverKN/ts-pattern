import { Primitive } from "./primitives";

type GetGenericType<T extends Primitive> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends bigint
  ? bigint
  : T extends symbol
  ? symbol
  : never;

export type IsLiteral<T extends Primitive> = GetGenericType<T> extends T ? false : true