export type ReadonlyArrayToNormal<TArr extends unknown[] | readonly unknown[]> = TArr extends
  | [infer First, ...infer Rest]
  | readonly [infer First, ...infer Rest]
  ? [ReadonlyToNormal<First>, ...ReadonlyArrayToNormal<Rest>]
  : TArr extends never[] | readonly never[]
  ? []
  : TArr extends (infer T)[] | readonly (infer T)[]
  ? T[]
  : [];

export type ReadonlyOrNormalArray<TArr extends unknown[]> = TArr extends [infer First, ...infer Rest]
  ? readonly [First, ...ReadonlyOrNormalArray<Rest>] | [First, ...ReadonlyOrNormalArray<Rest>]
  : TArr extends never[]
  ? []
  : TArr extends (infer T)[]
  ? readonly T[] | T[]
  : [];

type RorN = ReadonlyOrNormal<[1,2]>
// type Normal = ReadonlyToNormal<readonly [1, 2, readonly [3, 4]]>;

const test = { x: 1, arr: [1, 2] } as const;
type NormalObj = ReadonlyToNormal<typeof test>;

export type ReadonlyObjectToNormal<TObj extends Record<PropertyKey, unknown>> = {
  [key in keyof TObj]: ReadonlyToNormal<TObj[key]>;
};

type ReadonlyToNormal<T> = T extends unknown[] | readonly unknown[]
  ? ReadonlyArrayToNormal<T>
  : T extends Record<PropertyKey, unknown>
  ? ReadonlyObjectToNormal<T>
  : T;
