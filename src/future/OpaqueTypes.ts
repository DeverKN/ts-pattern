const SymbolForOpaqueTag = Symbol("OpaqueTag")
type SymbolForOpaqueTag = typeof SymbolForOpaqueTag

const SymbolForExtraData = Symbol("ExtraData")
type SymbolForExtraData = typeof SymbolForExtraData
export type OpaqueType<T, Tag extends string, ExtraData = never> = T & { [SymbolForOpaqueTag]: Tag, [SymbolForExtraData]: ExtraData}

type LessThanFive = OpaqueType<number, "LessThanFive">

const four = 4 as LessThanFive

const five = four + 1