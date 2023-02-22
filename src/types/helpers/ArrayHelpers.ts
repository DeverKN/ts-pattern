export type Shift<T extends unknown[]> = T extends [infer First, ...unknown[]] ? First : T
export type Unshift<TArr extends unknown[], T> = [T, ...TArr]

export type Pop<T extends unknown[]> = T extends [...unknown[], infer Last] ? Last : T
export type Push<TArr extends unknown[], T> = [...TArr, T]