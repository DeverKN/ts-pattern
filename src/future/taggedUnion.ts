import { _ } from "../code/binds";
import { flowMatch } from "../code/flowMatcher";
import { match } from "../code/matcher";
import { ExtractBindsFromTagged, ExtractObjectBindsHelper } from "../types/extract";
import { AnyArray } from "../types/helpers/AnyArray";
import { AnyObject } from "../types/helpers/AnyObject";
import { EmptyObject } from "../types/helpers/EmptyObject";
import { MergeUnionOfObjects } from "../types/helpers/flatten";
import { Pattern } from "../types/pattern";
import { Resolve } from "../types/resolve";

export const SymbolForTag = Symbol("Tag");
export type SymbolForTag = typeof SymbolForTag;

export const SymbolForTagBase = Symbol("TagBase");
export type SymbolForTagBase = typeof SymbolForTagBase;

export const SymbolForIsPattern = Symbol("IsPattern");
export type SymbolForIsPattern = typeof SymbolForIsPattern;

export type TaggedTuple<TTag extends string, T extends AnyArray | Pattern<AnyArray> = []> = T & { [SymbolForTag]: TTag };

export type Tagged<TTag extends string, T = never> = {
  [SymbolForTag]: TTag;
  [SymbolForTagBase]: T;
  // map: <U>(mapper: (arg: T) => U) => Tagged<TTag, U>;
  //[SymbolForIsPattern]: false;
};

export type TaggedObject<TTag extends string, T extends Record<PropertyKey, unknown> = never> = {
  [SymbolForTag]: TTag;
  [SymbolForTagBase]: T;
} & Readonly<{
  [Key in keyof T]: T[Key];
}>;

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

export type TaggedCreator<TTag extends string, T> = [T] extends [never] ? EmptyTaggedCreator<TTag> : NonEmptyTaggedCreator<TTag, T>;

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