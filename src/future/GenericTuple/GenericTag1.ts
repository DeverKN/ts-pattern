import { Not, Or } from "../../types/helpers/BooleanHelpers";
import { SymbolForTag, Untag, Tag, Tagged, SymbolForTagBase, TaggedCreator } from "../taggedUnion";
import { Kind1, URIS1 } from "./URI";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-unused-vars
export interface URIToKind1<A> {}

type GenericTag1 = <URI extends URIS1, TagName extends Kind1<URI, unknown>[SymbolForTag] = Kind1<URI, unknown>[SymbolForTag]>(tagName: TagName) =>
<A>() =>
<TInstance extends Untag<Kind1<URI, A>>>(instance: TInstance) => TaggedCreator<TagName, Untag<Instance<URI, TagName, unknown>>>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GenericTag1: GenericTag1 = void 0 as any /*
  <URI extends URIS1, TagName extends Kind1<URI, unknown>[SymbolForTag] = Kind1<URI, unknown>[SymbolForTag]>(tagName: TagName) =>
  <A>() =>
  <TInstance extends Untag<Kind1<URI, A>>>(instance: TInstance) => {
    return Tag<Kind1<URI, A>>(tagName)(instance);
  };*/

type Instance<URI extends URIS1, TagName extends string, A> = Extract<Kind1<URI, A>, Tagged<TagName, unknown>>;

type IsGeneric<URI extends URIS1, TagName extends string> = Instance<URI, TagName, string> extends Instance<URI, TagName, number>
  ? false
  : true;

type IsNever<URI extends URIS1, TagName extends string> = [Instance<URI, TagName, unknown>[SymbolForTagBase]] extends [never]
  ? true
  : false;

type GenericTaggedCreator1<URI extends URIS1, TagName extends string> = IsNever<URI, TagName> extends true
  ? () => Tagged<TagName>
  : IsGeneric<URI, TagName> extends false ? 
    TaggedCreator<TagName, Untag<Instance<URI, TagName, unknown>>>
  : <T>() => TaggedCreator<TagName, Untag<Instance<URI, TagName, T>>>//<TInstance extends Untag<Instance<URI, TagName, T>>>(instance: TInstance) => Tagged<TagName, TInstance>;

type MapTagNamesToMustCurry<URI extends URIS1, TInstanceTagNames extends string[]> = TInstanceTagNames extends []
  ? []
  : TInstanceTagNames extends [infer FirstTagName extends string, ...infer Rest extends string[]]
  ? [IsGeneric<URI, FirstTagName>, ...MapTagNamesToMustCurry<URI, Rest>]
  : never;

type GenericTags1 = <
  URI extends URIS1,
  TagNames extends Kind1<URI, unknown>[SymbolForTag] = Kind1<URI, unknown>[SymbolForTag]
>() => <TInstanceTagNames extends TagNames[]>(
  ...tagNames: TInstanceTagNames
) => (...mustCurryArr: MapTagNamesToMustCurry<URI, TInstanceTagNames>) => {
  [TagName in TagNames]: GenericTaggedCreator1<URI, TagName>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GenericTags1: GenericTags1 = void 0 as any;
