import { _ } from "../../code/binds";
import { match } from "../../code/matcher";
import { InferGenericType, SymbolForTag, UNSAFE_TagsArray, Where } from "../../future/taggedUnion";

test("match string literal", () => {
  expect(
    match("test")
      .against("else", () => "else")
      .against("test", () => "test")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("test");
});

test("bind string literal", () => {
  expect(
    match("test")
      .against(_("str"), ({ str }) => str)
      .exhaustive()
  ).toBe("test");
});

test("match number literal", () => {
  expect(
    match(2)
      .against(1, () => "one")
      .against(2, () => "two")
      .against(_, () => "num")
      .exhaustive()
  ).toBe("two");
});

test("bind number literal", () => {
  expect(
    match(2)
      .against(_("num"), ({ num }) => num)
      .exhaustive()
  ).toBe(2);
});

test("match tuple literal", () => {
  expect(
    match([1, 2] as [number, number])
      .against([2, 3], () => "two three")
      .against([1, 2], () => "one two")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("one two");
});

test("bind tuple literal", () => {
  expect(
    match([1, 2] as [number, number])
      .against(_("tuple"), ({ tuple }) => tuple)
      .exhaustive()
  ).toStrictEqual([1, 2]);
});

test("split tuple literal", () => {
  expect(
    match([1, 2] as [number, number])
      .against([_("one"), _("two")], ({ one, two }) => [one, two])
      .exhaustive()
  ).toStrictEqual([1, 2]);
});

test("match partial tuple literal", () => {
  expect(
    match([1, 2] as [number, number])
      .against([_("one"), 3], () => "one")
      .against([1, _("two")], () => "two")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("two");
});

test("tuple fallthrough wildcard", () => {
  expect(
    match([1, 2] as [number, number])
      .against([1, 3], () => "one")
      .against([5, 2], () => "two")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("rest");
});

test("tuple fallthrough match", () => {
  expect(
    match([1, 2] as [number, number])
      .against([1, 3], () => "one")
      .against([5, 2], () => "two")
      .against(_("rest"), ({ rest }) => ["rest", rest])
      .exhaustive()
  ).toStrictEqual(["rest", [1, 2]]);
});

// type IsType = typeof isResult extends MatchBind<string, infer TMatch> ? TMatch : never;

// test("extract nested tuple match", () => {
//   expect(
//     match([[1, 2], 3] as [[number, number], number])
//       .against([[1, 3], 2], () => "one")
//       .against([[5, 2], 9], () => "two")
//       .against([is("start", [_("one"), _("two")] as const), 3] as const, ({ start, one, two }) => [start, one, two])
//       .against(_, () => "rest")
//       .exhaustive()
//   ).toStrictEqual([[1, 2], 1, 2]);
// });

test("extract first and rest of list match", () => {
  expect(
    match([1, 2, 3, 4, 5] as number[])
      .against([_("first"), _("rest").s], ({ first, rest }) => {
        return { first, rest };
      })
      .against(_, () => "rest")
      .exhaustive()
  ).toStrictEqual({ first: 1, rest: [2, 3, 4, 5] });
});

test("match first and extract rest of list match", () => {
  expect(
    match([1, 2, 3, 4, 5] as number[])
      .against([2, _("rest").s], ({ rest }) => {
        return { rest, label: "ONE" };
      })
      .against([1, _("rest").s], ({ rest }) => {
        return { rest, label: "TWO" };
      })
      .against(_, () => "rest")
      .exhaustive()
  ).toStrictEqual({ rest: [2, 3, 4, 5], label: "TWO" });
});

test("match empty list with match", () => {
  expect(
    match([] as number[])
      .against([_("first"), _("rest").s], ({ first, rest }) => [first, rest])
      .against([], () => "empty")
      .exhaustive()
  ).toBe("empty");
});

test("match and extract string with array string pattern match", () => {
  expect(
    match("hello there")
      .against(["hello ", "person"], () => "person")
      .against(["hello ", "there"], () => "there")
      .against(_, () => "falllthrough")
      .exhaustive()
  ).toStrictEqual("there");
});

test("match and extract part of string with array string pattern match", () => {
  expect(
    match("hello there")
      .against([_("greeting"), "insert name here"], ({ name }) => name)
      .against(["hello ", _("name")], ({ name }) => name)
      .against(_, () => "falllthrough")
      .exhaustive()
  ).toStrictEqual("there");
});

test("match last and extract rest of list match", () => {
  expect(
    match([1, 2, 3, 4, 5] as number[])
      .against([_("rest").s, 6], ({ rest }) => {
        return { label: "SIX", rest };
      })
      .against([_("rest").s, 5], ({ rest }) => {
        return { label: "FIVE", rest };
      })
      .against(_, () => "rest")
      .exhaustive()
  ).toStrictEqual({ label: "FIVE", rest: [1, 2, 3, 4] });
});

test("extract last and rest of list match", () => {
  expect(
    match([1, 2, 3, 4, 5] as number[])
      .against([_("rest").s, _("last")], ({ last, rest }) => {
        return { last, rest };
      })
      .against(_, () => "rest")
      .exhaustive()
  ).toStrictEqual({ last: 5, rest: [1, 2, 3, 4] });
});

test("match object literal", () => {
  expect(
    match({ x: 1, y: "z" })
      .against({ x: 1, y: "z" }, () => "SUCCESS")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("SUCCESS");
});

test("match object literal with wildcards", () => {
  expect(
    match({ x: 1, y: "z" })
      .against({ x: 1, y: _ }, () => "SUCCESS")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("SUCCESS");
});

test("match object literal exactly", () => {
  expect(
    match({ x: 1, y: "z" })
      .against({ x: 2, y: "b" }, () => "FAIL")
      .against({ x: 1, y: "z" }, () => "SUCCESS")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("SUCCESS");
});

test("extract binds from object literal", () => {
  expect(
    match({ x: 1, y: "z" })
      .against({ x: 2, y: "b" }, () => "FAIL")
      .against({ x: 1, y: _("z") }, ({ z }) => ({ z, label: "SUCCESS" }))
      .against(_, () => "rest")
      .exhaustive()
  ).toStrictEqual({ z: "z", label: "SUCCESS" });
});

test("match symbol on object literal", () => {
  expect(
    match({ [SymbolForTag]: 1 })
      .against({ [SymbolForTag]: 0 }, () => "FAIL")
      .against({ [SymbolForTag]: 1 }, () => "SUCCESS")
      .against(_, () => "rest")
      .exhaustive()
  ).toBe("SUCCESS")
});

test("match algebraic data type", () => {
  type Tree<T> = Where<"Leaf"> | Where<"Node", { left: Tree<T>; right: Tree<T>; value: T }>;

  const { Leaf, Node } = UNSAFE_TagsArray<Tree<InferGenericType>>("Leaf", "Node");

  const inOrderTraversal = (tree: Tree<string | number>): string =>
    match(tree)
      .against(Leaf(), () => " ")
      .against(Node({ left: _("left"), right: _("right"), value: _("value") }), ({ left, right, value }) => {
        return `${inOrderTraversal(left)}${value}${inOrderTraversal(right)}`;
      })
      .exhaustive();

  const TestTree = Node({
    left: Node({
      left: Node({
        left: Leaf(),
        value: 0,
        right: Leaf()
      }),
      value: 1,
      right: Leaf(),
    }),
    value: 2,
    right: Node({
      left: Leaf(),
      value: 3,
      right: Leaf(),
    }),
  });

  expect(inOrderTraversal(TestTree)).toBe(" 0 1 2 3 ")
});
