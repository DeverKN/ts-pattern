import { Or } from "../../types/helpers/BooleanHelpers";
import { SymbolForTag, Untag, Tag, Tagged, TaggedCreator } from "../taggedUnion";
import { Kind2 } from "./URI";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface URIToKind2<A, B> {}

type URIS2 = keyof URIToKind2<unknown, unknown>

type Instance<URI extends URIS2, TagName extends string, A, B> = Extract<Kind2<URI, A, B>, Tagged<TagName, unknown>>;

type IsGenericForA<URI extends URIS2, TagName extends string> = Instance<URI, TagName, string, unknown> extends Instance<URI, TagName, number, unknown> ? false : true
type IsGenericForB<URI extends URIS2, TagName extends string> = Instance<URI, TagName, unknown, string> extends Instance<URI, TagName, unknown, number> ? false : true
type IsGeneric<URI extends URIS2, TagName extends string> = Or<IsGenericForA<URI, TagName> | IsGenericForB<URI, TagName>>

type GenericTag2 = <URI extends keyof URIToKind2<unknown, unknown>, TagName extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>(
  tagName: TagName
) =>
<A, B>() => TaggedCreator<TagName, Untag<Instance<URI, TagName, unknown, unknown>>>
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GenericTag2: GenericTag2 = void 0 as any
  /*<URI extends keyof URIToKind2<unknown, unknown>, TagName extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>(
    tagName: TagName
  ) =>
  <A, B>() =>
  <TInstance extends Untag<Kind2<URI, A, B>>>(instance: TInstance) => {
    return Tag<Kind2<URI, A, B>>(tagName)(instance);
  };*/



type GenericTags2 = <URI extends URIS2, TagNames extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>() => {
  [TagName in TagNames]: <A, B>() => TaggedCreator<TagName, Untag<Instance<URI, TagName, A, B>>>//<TInstance extends Untag<Extract<Kind2<URI, A, B>, Tagged<TagName, unknown>>>>(instance: TInstance) => Tagged<TagName, TInstance>
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GenericTags2: GenericTags2 = void 0 as any