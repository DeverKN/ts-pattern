type InvariantError<Msg> = {
  ErrorMsg: Msg;
};

export type Invariant<
  InvariantExpression extends boolean,
  Result,
  ErrorMsg extends string = "Invariant violated"
> = InvariantExpression extends true ? Result : InvariantError<ErrorMsg>;

export const wrapInvariant = <Cond extends boolean, T, Msg extends string>(t: T) => t as Invariant<Cond, T, Msg>