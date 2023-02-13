// import { KVObject } from "./KVObject"
import { KVObject } from "./KVObject";
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type MergeUnionOfObjects<OPlaceHolder, O = UnionToIntersection<OPlaceHolder>> = {
  [Key in keyof O]: O[Key];
};

type FlattenUnion<T extends Record<PropertyKey, unknown>> = T extends Record<
  PropertyKey,
  infer Nested extends Record<string, unknown>
>
  ? FlattenUnion<Nested>
  : T;

type ObjectToUnion<O> = {
  [Key in keyof O]: KVObject<Key, O[Key]>
}

export type Flatten<O> = MergeUnionOfObjects<FlattenUnion<ObjectToUnion<O>>>