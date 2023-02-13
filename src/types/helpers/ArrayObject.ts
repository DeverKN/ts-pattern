import { AnyObject } from "./AnyObject"
import { EmptyObject } from "./EmptyObject"

type ArrayObject = Record<PropertyKey, unknown[]>

export type MergeArrayObjects<T extends ArrayObject, U extends ArrayObject> = {
  [Key in keyof T | keyof U]: Key extends keyof T ? 
                                Key extends keyof U ? 
                                  [...T[Key], ...U[Key]] : 
                                  T[Key] : 
                                U[Key]
}

export type ObjectToArrayObject<T extends AnyObject> = {
  [Key in keyof T]: [T[Key]]
}

export type ArrayOfObjectsToObjectOfArrays<T extends AnyObject[]> = T extends [infer First extends AnyObject, ...infer Rest extends AnyObject[]] ? 
                                                                      Rest extends never[] ? 
                                                                        ObjectToArrayObject<First> :
                                                                        MergeArrayObjects<ObjectToArrayObject<First>, ArrayOfObjectsToObjectOfArrays<Rest>> :
                                                                    EmptyObject
