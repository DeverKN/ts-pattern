import { SymbolForTag, Untag, Tag } from "../taggedUnion";
import { Kind2 } from "./URI";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface URIToKind2<A, B> {}


export const GenericTag2 =
  <URI extends keyof URIToKind2<unknown, unknown>, TagName extends Kind2<URI, unknown, unknown>[SymbolForTag] = Kind2<URI, unknown, unknown>[SymbolForTag]>(
    tagName: TagName
  ) =>
  <A, B>() =>
  <TInstance extends Untag<Kind2<URI, A, B>>>(instance: TInstance) => {
    return Tag<Kind2<URI, A, B>>(tagName)(instance);
  };
