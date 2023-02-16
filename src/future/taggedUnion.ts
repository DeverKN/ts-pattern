// import { _ } from "../code/binds";
// import { match } from "../code/matcher";
// import { PredicateBind } from "../types/bind";
// import { ExtractBinds } from "../types/extract";
// import { EmptyObject } from "../types/helpers/EmptyObject";
// import { MergeObjects } from "../types/helpers/MergeObjects";
// import { Pattern } from "../types/pattern";



// export type TaggedUnionElement<TTag extends string, T extends Record<PropertyKey, unknown>> = MergeObjects<
//   T,
//   { [SymbolForTag]: TTag }
// >;
// type TaggedUnionElementPattern<
//   TTag extends string,
//   T extends Record<PropertyKey, unknown>,
//   TPattern extends Pattern<T>
// > = MergeObjects<TPattern, { [SymbolForTag]: TTag }>;

// // export type TaggedBase<TTag extends string, T extends Record<PropertyKey, unknown>> = TaggedUnionElement<TTag, T>

// export type Tagged<T extends TaggedUnionElement<string, Record<PropertyKey, unknown>>> = T extends TaggedUnionElement<
//   infer Tag,
//   infer TTagged
// >
//   ? TaggedUnionElement<Tag, TTagged>
//   : never;

// type TaggedCreator<TTag extends string, T extends Record<PropertyKey, unknown>> = <TInstance extends T | Pattern<T>>(
//   arg: TInstance
// ) => TInstance extends T ? TaggedUnionElement<TTag, TInstance> : TaggedUnionElementPattern<TTag, T, TInstance>;

// export const TaggedCreator = <TBase extends TaggedUnionElement<string, Record<PropertyKey, unknown>>>(
//   tag: TBase extends TaggedUnionElement<infer TTag, infer T> ? TTag : never
// ): TBase extends TaggedUnionElement<infer TTag, infer T> ? TaggedCreator<TTag, T> : never => {
//   type T = TBase extends TaggedUnionElement<infer TTag, infer T> ? T : never;
//   type TTag = TBase extends TaggedUnionElement<infer TTag, infer T> ? TTag : never;
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
//   return <any>(<TInstance extends T | Pattern<T>>(
//     arg: TInstance
//   ): TInstance extends T ? TaggedUnionElement<TTag, TInstance>: TaggedUnionElementPattern<TTag, T, TInstance> => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
//     return Object.assign(arg, { [SymbolForTag]: tag }) as any;
//   });
// };

// type Teacher = {
//   name: string;
//   grade: number;
//   pay: number;
// };

// type Student = {
//   name: string;
//   grade: number;
//   gpa: number;
// };

// const Teacher = TaggedCreator<"Teacher", Teacher>("Teacher");
// // const instance = Teacher({ name: "Cat", grade: _, pay: 1000 });
// const Student = TaggedCreator<"Student", Student>("Student");

// // type User = ReturnType<typeof Teacher> | ReturnType<typeof Student>;
// type User = Tagged<typeof Teacher | typeof Student>;

// const handlerUser = (user: User) => {
//   switch (user[SymbolForTag]) {
//     case "Student": {
//       const { name, gpa, grade } = user;
//       return `Congrats ${name} your GPA is ${gpa}!`;
//     }
//     case "Teacher": {
//       const { name, pay, grade } = user;
//       return `Congrats ${name} your pay is $${pay}per week!`;
//     }
//   }
// };

// const Sally = Teacher({ name: "Sally", grade: 12, pay: 1000 });
// const Grade12Teacher = Teacher({ name: _, grade: 20, pay: _ });

// type Leaf = TaggedUnionElement<"Leaf", EmptyObject>;

// type Node = TaggedUnionElement<
//   "Node",
//   {
//     value: string;
//     left: Leaf | Node;
//     right: Leaf | Node;
//   }
// >;

// // type BasicLeaf = null
// // type BasicNode = {
// //   value: string,
// //   left: BasicTree,
// //   right: BasicTree
// // }

// // type BasicTree = BasicLeaf | BasicNode

// type Tree = Leaf | Node;

// const Leaf = TaggedCreator<Leaf>("Leaf");
// const Node = TaggedCreator<Node>("Node");

// const Match = Node({ value: _("value"), left: _("left"), right: _("right") });
// type MatchType = typeof Match;

// type Merged = MergeObjects<
//   { value: PredicateBind<"val", any>; left: PredicateBind<"left", any>; right: PredicateBind<"right", any> },
//   {
//     [SymbolForTag]: "Node";
//   }
// >;

// type TaggedNode = Tagged<Node>;
// type Extracted = ExtractBinds<TaggedNode, MatchType>;

// type Extracted2 = ExtractBinds<
//   { value: string; left: Tree | number; right: Node | number; [SymbolForTag]: "TEST" },
//   {
//     value: PredicateBind<"value", any>;
//     left: PredicateBind<"left", any>;
//     right: PredicateBind<"right", any>;
//     [SymbolForTag]: "TEST";
//   }
// >;

// const inOrderTraverse = (tree: Tree): string => {
//   return match(tree)
//     .against(Leaf({}), () => {
//       return "";
//     })
//     .against(Match, ({ value, left, right }) => {
//       return inOrderTraverse(left) + value + inOrderTraverse(right);
//     })
//     .exhaustive();
// };

export {}