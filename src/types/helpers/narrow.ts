// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Narrow<T, U> = [T] extends [any] ? (U extends T ? U : T) : U;

export type NarrowArray<T, UArr extends unknown[]> = UArr extends [infer UFirst, ...infer URest]
  ? URest extends never[]
    ? [Narrow<T, UFirst>]
    : [Narrow<T, UFirst>, ...NarrowArray<T, URest>]
  : UArr extends (infer U)[]
  ? Narrow<T, U>[]
  : [];
