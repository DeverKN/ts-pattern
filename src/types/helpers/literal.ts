export type Literal = string | number | symbol
type LiteralOrTuple = Literal | Record<PropertyKey, unknown> | LiteralOrTuple[]
// type TupleHelper<T extends (Literal | Tuple)[]> = T & {__tuple: true}
// type Tuple = TupleHelper<(Literal | TupleHelper<Tuple>)[]>
export type Tuple = LiteralOrTuple[]