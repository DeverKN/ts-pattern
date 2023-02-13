import { Tuple } from "../types/helpers/literal";

export const tuple = <TArgs extends Tuple>(...args: TArgs): TArgs => args