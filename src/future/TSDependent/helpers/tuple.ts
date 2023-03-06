export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type Push<TArr extends unknown[], T> = [...TArr, T];

export type Pop<TArr extends unknown[]> = TArr extends [...infer Rest extends unknown[], unknown] ? Rest : [];

export type Length<Arr extends unknown[]> = Arr["length"]