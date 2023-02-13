import { AnyObject } from "./AnyObject";

export type MergeObjects<T extends AnyObject, U extends AnyObject> = T extends Record<string, never>
  ? U
  : U extends Record<string, never>
  ? T
  : {
      [Key in keyof T | keyof U]: Key extends keyof T ? T[Key] : U[Key];
    };

// type Merged = MergeObjects<{ x: 1 }, Record<string, never>>;
