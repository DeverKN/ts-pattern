import { UNSAFE_UnionToIntersection } from "./UNSAFE_UnionToIntersection";

type LastOf<T> = UNSAFE_UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>;

export { TuplifyUnion as UNSAFE_TuplifyUnion };
