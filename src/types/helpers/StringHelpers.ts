export type Trim<T> = T extends `${infer First} `
  ? Trim<First>
  : T extends `${infer First}\n`
  ? Trim<First>
  : T extends ` ${infer First}`
  ? Trim<First>
  : T;

export type Split<T, Seperator extends string> = T extends `${infer First}${Seperator}${infer Rest}`
  ? [First, ...Split<Rest, Seperator>]
  : [T];
