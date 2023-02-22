export type And<T extends boolean> = T extends false ? false : true
export type Or<T extends boolean> = T extends true ? true : false
export type Not<T extends boolean> = T extends true ? false : true