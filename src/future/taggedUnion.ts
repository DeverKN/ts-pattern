import { IsTuple } from "../types/helpers/IsTuple";
import { UNSAFE_TuplifyUnion } from "../types/helpers/UNSAFE_TuplifyUnion";
import { ArrayPattern, Pattern } from "../types/pattern";

export const SymbolForTag = Symbol("Tag");
export type SymbolForTag = typeof SymbolForTag;

export const SymbolForTagBase = Symbol("TagBase");
export type SymbolForTagBase = typeof SymbolForTagBase;

export const SymbolForIsPattern = Symbol("IsPattern");
export type SymbolForIsPattern = typeof SymbolForIsPattern;

export type Tagged<TTag extends string, T = never> = {
  [SymbolForTag]: TTag;
  [SymbolForTagBase]: T;
};

export type Where<TTag extends string, T = never> = [T] extends [never]
  ? Tagged<TTag, T>
  : T extends [unknown]
  ? never
  : Tagged<TTag, T>;

type TOrPattern<T> = T | Pattern<T>;
export type Untag<T extends Tagged<string, unknown>> = T[SymbolForTagBase];

export const map = <TTag extends string, T, U>(tagged: Tagged<TTag, T>, mapper: (arg: T) => U): Tagged<TTag, U> => {
  const tag = tagged[SymbolForTag];
  const tagBase = tagged[SymbolForTagBase];
  return {
    [SymbolForTag]: tag,
    [SymbolForTagBase]: mapper(tagBase),
  };
};

type NonEmptyTaggedCreator<TTag extends string, T> = T extends unknown[]
  ? IsTuple<T> extends true
    ? <TInstance extends T | ArrayPattern<T>>(...args: TInstance) => Tagged<TTag, TInstance>
    : <TInstance extends TOrPattern<T>>(...args: [TInstance]) => /*TInstance extends T ?*/ Tagged<TTag, TInstance>
  : /*T extends EmptyObject
  ? EmptyTagCreator<TTag>
  : */ <TInstance extends TOrPattern<T>>(
      ...args: [TInstance]
    ) => /*TInstance extends T ?*/ Tagged<TTag, TInstance> /* : TaggedPattern<TTag, TInstance>*/;

type EmptyTaggedCreator<TTag extends string> = () => /*TInstance extends T ?*/ Tagged<TTag>;

export type TaggedCreator<TTag extends string, T> = [T] extends [never]
  ? EmptyTaggedCreator<TTag>
  : NonEmptyTaggedCreator<TTag, T>;

export function Tag<T extends Tagged<string, unknown>>(
  tag: T[SymbolForTag]
): TaggedCreator<T[SymbolForTag], T[SymbolForTagBase]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  // return ((arg: any) => Object.assign(tag, arg)) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
  const creator = <TaggedCreator<T[SymbolForTag], T[SymbolForTagBase]>>((...args: unknown[]) => {
    if (args.length === 0) {
      const [arg] = args;
      return {
        [SymbolForTag]: tag,
        [SymbolForTagBase]: arg,
      };
    } else {
      return {
        [SymbolForTag]: tag,
        [SymbolForTagBase]: args,
      };
    }
  });
  return creator;
}

type TagCreatorObject<T extends Tagged<string, unknown>> = {
  [TagName in T[SymbolForTag]]: TaggedCreator<TagName, Extract<T, Tagged<TagName, unknown>>[SymbolForTagBase]>;
};

export type Tags = <T extends Tagged<string, unknown>>() => <TTags extends T[SymbolForTag]>(
  ...tags: TTags[]
) => TagCreatorObject<Extract<T, Tagged<TTags, unknown>>>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const Tags: Tags = <T extends Tagged<string, unknown>>() => <TTags extends T[SymbolForTag]>(
  ...tags: TTags[]
): TagCreatorObject<Extract<T, Tagged<TTags, unknown>>> => {
  return Object.fromEntries(tags.map((tagName) => [tagName, Tag(tagName)])) as TagCreatorObject<Extract<T, Tagged<TTags, unknown>>>
}

export type UNSAFE_TagsArray = <T extends Tagged<string, unknown>>(...tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>) => TagCreatorObject<T>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const UNSAFE_TagsArray: UNSAFE_TagsArray = <T extends Tagged<string, unknown>>(...tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>) => {
  return Object.fromEntries(tags.map((tagName) => [tagName, Tag(tagName as string)])) as TagCreatorObject<T>
}

export type InferGenericType = unknown;
