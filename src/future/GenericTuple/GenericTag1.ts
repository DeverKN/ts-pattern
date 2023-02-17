import { SymbolForTag, Untag, Tag } from "../taggedUnion";
import { Kind1, URIS1 } from "./URI";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-unused-vars
export interface URIToKind1<A> {
}


export const GenericTag1 =
  <URI extends URIS1, TagName extends Kind1<URI, unknown>[SymbolForTag] = Kind1<URI, unknown>[SymbolForTag]>(tagName: TagName) =>
  <A>() =>
  <TInstance extends Untag<Kind1<URI, A>>>(instance: TInstance) => {
    return Tag<Kind1<URI, A>>(tagName)(instance);
  };