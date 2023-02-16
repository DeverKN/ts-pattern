// import { KVObject } from "./KVObject"
// import { KVObject } from "./KVObject";

import { KVBindObject } from "../extract";
import { KVObject } from "./KVObject";
import { KVPair, KVPairUnionToObject } from "./KVPair";

// export type KVPair<K extends PropertyKey, V> = {
//   K: K,
//   V: V
// }

export type AnyKey<T> = T extends T ? keyof T : never;
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type MergeUnionOfObjects<O> = {
  [Key in AnyKey<O>]: Extract<O, KVObject<Key, unknown>>[Key];
};

export type FlattenUnionHelper<T extends KVPair<PropertyKey, unknown>> = T extends KVPair<
  PropertyKey,
  infer Nested extends KVPair<PropertyKey, unknown>
>
  ? FlattenUnionHelper<Nested>
  : T;

export type FlattenUnion<T extends Record<PropertyKey, unknown>> = T extends Record<
  PropertyKey,
  infer Nested extends KVPair<PropertyKey, unknown>
>
  ? FlattenUnionHelper<Nested>
  : T;

export type FlattenRecordToArray<T extends Record<PropertyKey, unknown>> = T extends Record<
  PropertyKey,
  infer Nested extends Record<PropertyKey, unknown>
>
  ? FlattenRecordToArray<Nested>
  : T;

// type Flat = FlattenRecordToArray<ObjectToUnion<{ x: 1; y: { z: 2 | 3 } }>>;

// export type FlattenRecordToUnionSafe<T extends Record<PropertyKey, unknown>> = FlattenRecordToUnion<T> extends never
//   ? T
//   : FlattenRecordToUnion<T>;

export type ObjectToUnion<O> = ObjectToUnionHelper<MergeUnionOfObjects<O>>;

type ObjectToUnionHelper<O> = O[keyof O];
// type ObjectToUnionHelper<O> = {
//   [Key in keyof O]: KVPair<Key, O[Key]>;
// }[keyof O];

export type ObjectToObjectUnion<O> = {
  [Key in keyof O]: KVObject<Key, O[Key]>;
};

export type ObjectToKVUnion<O> = {
  [Key in keyof O]: KVPair<Key, O[Key]>;
};

export type FlattenBindObject<T extends Record<PropertyKey, unknown>> = T extends Record<
  PropertyKey,
  infer Nested extends KVObject<PropertyKey, unknown>
>
  ? Nested extends KVBindObject<PropertyKey, unknown>
    ? Nested
    : FlattenBindObject<Nested>
  : T;

export type FlattenDangerous<O> = MergeUnionOfObjects<FlattenBindObject<MergeUnionOfObjects<ObjectToUnion<O>>>>;
// type FlattenSafe<O> = FlattenDangerous<O> extends never ? O : FlattenDangerous<O>;

export type Flatten<O> = FlattenDangerous<O>;
