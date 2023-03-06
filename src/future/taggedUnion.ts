import { ArrayVals } from "../types/helpers/ArrayVals";
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

// export type Where<TTag extends string, T = never> = [T] extends [never]
//   ? Tagged<TTag, T>
//   : T extends [unknown]
//   ? never
//   : Tagged<TTag, T>;

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

type EmptyTaggedInstance<TTag extends string> = Tagged<TTag>;
export type TaggedCreatorWithEmpty<TTag extends string, T> = [T] extends [never]
  ? EmptyTaggedInstance<TTag>
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

type TagCreatorObjectWithEmpty<T extends Tagged<string, unknown>> = {
  [TagName in T[SymbolForTag]]: TaggedCreatorWithEmpty<TagName, Extract<T, Tagged<TagName, unknown>>[SymbolForTagBase]>;
};

// type TaggedNeverToTrue<T> = T extends Tagged<string, never> ? true : false;

// type MapTaggedNeverToTrue<T> = T extends [infer First extends Tagged<string, unknown>]
//   ? TaggedNeverToTrue<First>
//   : T extends [infer First extends Tagged<string, unknown>, ...infer Rest extends Tagged<string, unknown>[]]
//   ? [TaggedNeverToTrue<First>, ...MapTaggedNeverToTrue<Rest>]
//   : [];

export type Tags = <T extends Tagged<string, unknown>>() => <TTags extends T[SymbolForTag]>(
  ...tags: TTags[]
) => TagCreatorObject<Extract<T, Tagged<TTags, unknown>>>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const Tags: Tags =
  <T extends Tagged<string, unknown>>() =>
  <TTags extends T[SymbolForTag]>(...tags: TTags[]): TagCreatorObject<Extract<T, Tagged<TTags, unknown>>> => {
    return Object.fromEntries(tags.map((tagName) => [tagName, Tag(tagName)])) as TagCreatorObject<
      Extract<T, Tagged<TTags, unknown>>
    >;
  };

type MapTagNameToConstructorType<TTags extends Tagged<string, unknown>, TName extends string> = Extract<
  TTags,
  Tagged<TName, unknown>
> extends Tagged<string, infer T>
  ? [T] extends [never]
    ? false
    : true
  : never;

type MapTagNameListToConstructorTypes<TTags extends Tagged<string, unknown>, TNames extends string[]> = TNames extends [
  infer Name extends string
]
  ? [MapTagNameToConstructorType<TTags, Name>]
  : TNames extends [infer Name extends string, ...infer Rest extends string[]]
  ? [MapTagNameToConstructorType<TTags, Name>, ...MapTagNameListToConstructorTypes<TTags, Rest>]
  : [];

// type Tree<T> = Tagged<"Leaf"> | Tagged<"Node", { value: T; left: Tree<T>; right: Tree<T> }>;
// type Mapped = MapTagNameListToConstructorTypes<Tree<InferGenericType>, ["Leaf", "Node"]>

export type TagsWithEmptyConstructors = <T extends Tagged<string, unknown>>() => <TTags extends T[SymbolForTag], TNames extends TTags[]>(
  ...tags: TNames
) => <TIsEmpty extends MapTagNameListToConstructorTypes<T, TNames>>(
  ...isEmpty: TIsEmpty
) => TagCreatorObjectWithEmpty<Extract<T, Tagged<ArrayVals<TNames>, unknown>>>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const TagsWithEmptyConstructors: TagsWithEmptyConstructors = void 0 as any
  // <T extends Tagged<string, unknown>>() =>
  // <TTags extends T[SymbolForTag]>(...tags: TTags[]): TagCreatorObject<Extract<T, Tagged<TTags, unknown>>> => {
  //   return Object.fromEntries(tags.map((tagName) => [tagName, Tag(tagName)])) as TagCreatorObject<
  //     Extract<T, Tagged<TTags, unknown>>
  //   >;
  // };

export type UNSAFE_TagsArray = <T extends Tagged<string, unknown>>(
  ...tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>
) => TagCreatorObject<T>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const UNSAFE_TagsArray: UNSAFE_TagsArray = <T extends Tagged<string, unknown>>(
  ...tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>
) => {
  return Object.fromEntries(tags.map((tagName) => [tagName, Tag(tagName as string)])) as TagCreatorObject<T>;
};

const zip = <T, U>(t: T[], u: U[]): [T, U][] => {
  return t.map((item, index) => {
    return [item, u[index]];
  });
};

// export type UNSAFE_TagsArrayWithEmptyConstructors = <T extends Tagged<string, unknown>>(
//   tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>,
//   isEmpty: MapTaggedNeverToTrue<UNSAFE_TuplifyUnion<T>>
// ) => TagCreatorObjectWithEmpty<T>;
// // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
// export const UNSAFE_TagsArrayWithEmptyConstructors: UNSAFE_TagsArrayWithEmptyConstructors = <
//   T extends Tagged<string, unknown>
// >(
//   tags: UNSAFE_TuplifyUnion<T[SymbolForTag]>,
//   isEmpty: MapTaggedNeverToTrue<UNSAFE_TuplifyUnion<T>>
// ) => {
//   const zipped = zip(tags as string[], isEmpty as boolean[]);
//   const mapped = zipped.map(([tagName, isEmptyConstructor]) => {
//     if (isEmptyConstructor) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
//       return [tagName, (Tag(tagName) as any)() as Tagged<string>] as const;
//     } else {
//       return [tagName, Tag(tagName)] as const;
//     }
//   });

//   const result: TagCreatorObjectWithEmpty<T> = Object.fromEntries(mapped) as TagCreatorObjectWithEmpty<T>;
//   return result;
// };

export type InferGenericType = unknown;
