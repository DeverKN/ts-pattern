export type IsTuple<T extends unknown[]> = T extends (infer TArr)[] ? TArr[] extends T ? false : true : false