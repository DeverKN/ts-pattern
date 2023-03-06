export type Extends<T, U> = T extends U ? true : false;
export type ExtendsAll<T, U> = false extends Extends<T, U> ? false : true