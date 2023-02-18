import { Pattern } from "../types/pattern";

export const SymbolForTag = Symbol("Tag");
export type SymbolForTag = typeof SymbolForTag;

export const SymbolForTagBase = Symbol("TagBase");
export type SymbolForTagBase = typeof SymbolForTagBase;

export const SymbolForIsPattern = Symbol("IsPattern");
export type SymbolForIsPattern = typeof SymbolForIsPattern;

// type TaggedTuple<TTag extends string, T extends AnyArray | Pattern<AnyArray> = []> = T & { [SymbolForTag]: TTag };

export type Tagged<TTag extends string, T = never> = {
  [SymbolForTag]: TTag;
  [SymbolForTagBase]: T;
};

// type TaggedObject<TTag extends string, T extends Record<PropertyKey, unknown> = never> = {
//   [SymbolForTag]: TTag;
//   [SymbolForTagBase]: T;
// } & Readonly<{
//   [Key in keyof T]: T[Key];
// }>;

type TOrPattern<T> = T | Pattern<T>;
export type Untag<T extends Tagged<string, unknown>> = TOrPattern<T[SymbolForTagBase]>;

export const map = <TTag extends string, T, U>(tagged: Tagged<TTag, T>, mapper: (arg: T) => U): Tagged<TTag, U> => {
  const tag = tagged[SymbolForTag];
  const tagBase = tagged[SymbolForTagBase];
  return {
    [SymbolForTag]: tag,
    [SymbolForTagBase]: mapper(tagBase),
  };
};


type NonEmptyTaggedCreator<TTag extends string, T> = /*T extends EmptyObject
  ? EmptyTagCreator<TTag>
  : */ <TInstance extends T | Pattern<T>>(
  arg: TInstance
) => /*TInstance extends T ?*/ Tagged<TTag, TInstance> /* : TaggedPattern<TTag, TInstance>*/;

type EmptyTaggedCreator<TTag extends string> = () => /*TInstance extends T ?*/ Tagged<TTag>;

type TaggedCreator<TTag extends string, T> = [T] extends [never] ? EmptyTaggedCreator<TTag> : NonEmptyTaggedCreator<TTag, T>;

export function Tag<T extends Tagged<string, unknown>>(
  tag: T[SymbolForTag]
): TaggedCreator<T[SymbolForTag], T[SymbolForTagBase]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  // return ((arg: any) => Object.assign(tag, arg)) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
  const creator = <TaggedCreator<T[SymbolForTag], T[SymbolForTagBase]>>((arg) => ({
    [SymbolForTag]: tag,
    [SymbolForTagBase]: arg,
  }));
  return creator;
}