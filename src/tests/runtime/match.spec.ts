import { _ } from "../../code/binds";
import { isNonExhaustiveError } from "../../code/match";
import { match } from "../../code/matcher";
import { c } from "../../future/Tuple";
import { ifLet } from "../../future/ifLet";
import { InferGenericType, SymbolForTag, Tagged, Tags, UNSAFE_TagsArray } from "../../future/taggedUnion";

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

test("rest bind matches empty", () => {
  expect(
    match([1])
      .against([1, _("rest").rest], () => "REST")
      .against(_, () => "FALL")
      .exhaustive()
  ).toBe("REST");
});

test("sum list", () => {
  const sum = (list: number[]): number =>
    match(list)
      .against([_("first"), _("rest").rest], ({ first, rest }) => first + sum(rest))
      .against([], () => 0)
      .exhaustive();

  expect(sum([1, 2, 3, 4, 5])).toBe(15);
});

// test("as bind extracts full match", () => {
//   const matchBind = as("match", [_("first"), _("rest").s])
//   const sum = (list: number[]): number =>
//     match(list)
//       .against(matchBind, ({ match, first, rest }) => [match, first, rest])
//       .against([], () => 0)
//       .exhaustive();

//   expect(sum([1, 2, 3, 4, 5])).toBe(15);
// });

// test("sum list, empty first", () => {
//   const sum = (list: number[]): number =>
//     match(list)
//       .against([], () => 0)
//       .against([_("first"), _("rest").rest], ({ first, rest }) => first + sum(rest))
//       .exhaustive();

//   expect(sum([1, 2, 3, 4, 5])).toBe(15);
// });

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
  ).toBe("SUCCESS");
});

// test("match set", () => {
//   expect(
//     match(new Set([1,2,3]))
//       .against(new Set([1,2,3,4,5]), () => "TOO MANY")
//       .against(new Set([1,2]), () => "TOO FEW")
//       .against(new Set([1,2,3]), () => "JUST RIGHT")
//       .against(_, () => "rest")
//       .exhaustive()
//   ).toBe("JUST RIGHT")
// });

// test("match map", () => {
//   expect(
//     match(new Map([["a", "b"], ["c", "d"]]))
//       .against(new Map([["a", "b"], ["c", "d"], ["x", "y"]]), () => "TOO MANY")
//       .against(new Map([["a", "b"]]), () => "TOO FEW")
//       .against(new Map([["a", "b"], ["c", "d"]]), () => "JUST RIGHT")
//       .against(_, () => "rest")
//       .exhaustive()
//   ).toBe("JUST RIGHT")
// });

test("match algebraic data type", () => {
  type Tree<T> = Tagged<"Leaf"> | Tagged<"Node", { left: Tree<T>; right: Tree<T>; value: T }>;

  const { Leaf, Node } = Tags<Tree<InferGenericType>>()("Leaf", "Node");

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
        right: Leaf(),
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

  expect(inOrderTraversal(TestTree)).toBe(" 0 1 2 3 ");
});

type List<T> = Tagged<"Nil"> | Tagged<"Cons", [T, List<T>]>;
const { Nil, Cons } = Tags<List<InferGenericType>>()("Nil", "Cons");

const sum = (list: List<number>): number =>
  match(list)
    .against(Nil(), () => 0)
    .against(Cons(_("x"), _("xs")), ({ x, xs }) => x + sum(xs))
    .exhaustive();

test("sum ADT", () => {
  expect(sum(Cons(15, Nil()))).toBe(15);
});

test("exhaustive returns nonExhaustiveError for fallthrought", () => {
  expect(isNonExhaustiveError(match(5 as number).against(4, () => "FOUR").exhaustive)).toBe(true);
});

test("fallback returns value for match", () => {
  expect(
    match(5 as number)
      .against(5, () => "FIVE")
      .fallback(() => "FALLBACK")
  ).toBe("FIVE");
});

test("fallback returns fallback value for fallthrough", () => {
  expect(
    match(5 as number)
      .against(4, () => "FOUR")
      .fallback(() => "FALLBACK")
  ).toBe("FALLBACK");
});

test("run returns value for match", () => {
  expect(
    match(5 as number)
      .against(5, () => "FIVE")
      .run()
  ).toBe("FIVE");
});

test("run returns undefined for fallthrough", () => {
  expect(
    match(5 as number)
      .against(4, () => "FOUR")
      .run()
  ).toBe(undefined);
});

test("assertRun returns value for match", () => {
  expect(
    match(5 as number)
      .against(5, () => "FIVE")
      .assertRun()
  ).toBe("FIVE");
});

test("assertRun throws error for fallthrough", () => {
  expect(() =>
    match(5 as number)
      .against(4, () => "FOUR")
      .assertRun()
  ).toThrowError("Pattern is not exhaustive for input 5");
});

type Option<T> = Tagged<"Some", T> | Tagged<"None">;
const { Some, None } = UNSAFE_TagsArray<Option<InferGenericType>>("Some", "None");

const unwrap = <T>(option: Option<T>): T => {
  ifLet(None(), option, () => {
    throw Error(`Attemped to unwrap a "None" value`);
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ifLet(Some(_("val")), option, ({ val }) => {
    return val;
  })!;
};

it("unwrapping a some value returns inner value", () => {
  expect(unwrap(Some(5))).toBe(5);
});

it("unwrapping a none value throws an error", () => {
  expect(() => unwrap(None())).toThrowError(`Attemped to unwrap a "None" value`);
});

it("should extract types from tuple", () => {
  expect(
    match(c([1, 2]))
      .against(c([_("x"), _("y")]), ({ x, y }) => {
        return [x, y];
      })
      .exhaustive()
  ).toStrictEqual([1, 2]);
});

test("discriminated union type inference", () => {
  type DogOrTree =
    | Tagged<"Dog", { age: number; bark: () => string }>
    | Tagged<"Tree", { age: number; bark: boolean }>;

  const { Dog, Tree } = Tags<DogOrTree>()("Dog", "Tree");

  //Incorrect
  const meet = (item: DogOrTree) => {
    return match(item)
      .against(Dog({ age: _, bark: _("bark") }), ({ bark }) => {
        bark();
        //^Works fine, typeof bark is () => void
      })
      .against(Tree({ age: _, bark: _("bark") }), ({ bark }) => {
        // bark();
        //^TypeError, typeof bark is boolean
      })
      .exhaustive();
  };

  //Correct
  const meet$ = (item: DogOrTree) => {
    return match(item)
      .against(Dog({ age: _, bark: _("bark") }), ({ bark }) => {
        bark();
        return "Dog!";
      })
      .against(Tree({ age: _, bark: _("bark") }), ({ bark }) => {
        return `Tree ${bark ? "with" : "without"} bark`;
      })
      .exhaustive();
  };

  //Correct
  // const meet$$ = (item: DogOrTree) => {
  //   return match(item)
  //     .against(Tree({ age: _, bark: _("bark") }), ({ bark }) => {
  //       return `Tree ${bark ? "with" : "without"} bark`;
  //     })
  //     .against({bark}, ({ dog }) => {
  //       dog.bark();
  //       return "Dog!";
  //     })
  //     .exhaustive();
  // };
});
