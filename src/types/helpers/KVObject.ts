export type KVObject<K extends PropertyKey, V> = {
  [Key in K]: V
}