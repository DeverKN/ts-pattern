export type AssertNever<T, TReturn, TError> = [T] extends [never] ? TReturn : TError;

export type NonExhaustiveError<T> = { __nonExhaustive: T };