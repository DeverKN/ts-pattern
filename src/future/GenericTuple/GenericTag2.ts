import { SymbolForTag, Untag, Tag, Tagged } from "../taggedUnion";
import { Kind2 } from "./URI";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface URIToKind2<A, B> {}

type URIS2 = keyof URIToKind2<unknown, unknown>

export const GenericTag2 =
  <URI extends keyof URIToKind2<unknown, unknown>, TagName extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>(
    tagName: TagName
  ) =>
  <A, B>() =>
  <TInstance extends Untag<Kind2<URI, A, B>>>(instance: TInstance) => {
    return Tag<Kind2<URI, A, B>>(tagName)(instance);
  };

type GenericTags2 = <URI extends URIS2, TagNames extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>() => {
  [TagName in TagNames]: <A, B>() => <TInstance extends Untag<Extract<Kind2<URI, A, B>, Tagged<TagName, unknown>>>>(instance: TInstance) => Tagged<TagName, TInstance>
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GenericTags2: GenericTags2 = void 0 as any