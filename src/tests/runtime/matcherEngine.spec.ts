import { _ } from "../../code/binds";
import { isBind, isWildCard } from "../../code/matcherEngine";

test("detect wildcard", () => {
  expect(isWildCard(_)).toBe(true);
});

test.each([
  [_, true],
  [_("test"), true],
])("detect bind", (bind, expected) => {
  expect(isBind(bind)).toBe(expected);
});
