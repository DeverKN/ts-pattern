import { AnyObject } from "./AnyObject";

export type HardMergeObjects<T extends AnyObject, U extends AnyObject> = {
      [Key in keyof T | keyof U]: Key extends keyof T ? T[Key] : U[Key];
    };
    
export type MergeObjects<T extends AnyObject, U extends AnyObject> = T extends Record<PropertyKey, never>
  ? U
  : U extends Record<PropertyKey, never>
  ? T
  : {
      [Key in keyof T | keyof U]: Key extends keyof T ? T[Key] : U[Key];
    };

// type Merged = MergeObjects<{ x: 1 }, Record<string, never>>;
