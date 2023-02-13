export type KVPair<K extends PropertyKey, V> = {
  K: K,
  V: V
}

export type KVPairUnionToObject<KVPairs extends KVPair<PropertyKey, unknown>> = {
  [Key in KVPairs["K"]]: Extract<KVPairs, KVPair<Key, unknown>>["V"]
}

export type ObjectToKVPairUnion<O> = {
  [Key in keyof O]: KVPair<Key, O[Key]>
}[keyof O]