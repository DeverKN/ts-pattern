import { URIToKind1 } from "./GenericTag1";
import { URIToKind2 } from "./GenericTag2";

export type URIS1 = keyof URIToKind1<unknown>
export type Kind1<URI extends keyof URIToKind1<T>, T> = URIToKind1<T>[URI]; 

export type URIS2 = keyof URIToKind2<unknown, unknown>
export type Kind2<URI extends keyof URIToKind2<A, B>, A, B> = URIToKind2<A, B>[URI];