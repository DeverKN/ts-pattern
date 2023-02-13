import { Literal } from "../types/helpers/literal";

export const literal = <T extends Literal>(arg: T): T => arg