export type AssertNever<T, TReturn, TError> = [T] extends [never] ? TReturn : TError;

export type NonExhaustiveError = { _nonExhaustive: null };