import { _ } from "../code/binds";
import { match } from "../code/matcher";
import { AnyObject } from "../types/helpers/AnyObject";
import { EmptyObject } from "../types/helpers/EmptyObject";
import { MergeObjects } from "../types/helpers/MergeObjects";
import { Pattern } from "../types/pattern";

export const SymbolForTag = Symbol("Tag");
export type SymbolForTag = typeof SymbolForTag;

export type TaggedTuple<TTag extends string, T extends unknown[]> = T & { [SymbolForTag]: TTag };

export type Tagged<TTag extends string, T extends AnyObject = EmptyObject> = MergeObjects<T, { [SymbolForTag]: TTag }>;

// type EmptyTagCreator<TTag extends string> = () => Tagged<TTag>;
type TagCreator<TTag extends string, T extends AnyObject> = /*T extends EmptyObject
  ? EmptyTagCreator<TTag>
  : */<TInstance extends T | Pattern<T>>(...arg: T extends EmptyObject ? [] : [TInstance]) => Tagged<TTag, TInstance>;

export const Tag = <T extends Tagged<string, AnyObject>>(
  tag: T extends Tagged<infer TTag extends string, AnyObject> ? TTag : never
): T extends Tagged<infer TTag, infer TObj> ? TagCreator<TTag, Omit<T, SymbolForTag>> : never => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return ((arg: any) => Object.assign(tag, arg)) as any;
};

// type BasicLeaf = EmptyObject;
// type BasicNode = {
//   value: string;
//   left: BasicTree;
//   right: BasicTree;
// };

// type BasicTree = BasicLeaf | BasicNode;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument

// // const l = Leaf();
// const basicInOrderTraversal = (tree: BasicTree): string => {
//   const res: string = match(tree)
//     .against({} as EmptyObject, () => "")
//     .against({ value: _("value"), left: _("left"), right: _("right") }, ({ value, left, right }) => {
//       return basicInOrderTraversal(left) + value + basicInOrderTraversal(right);
//     })
//     .exhaustive();
//   return res;
// };

// type GenericLeaf<T> = Tagged<"GenericLeaf", EmptyObject>;
// type GenericNode<T> = Tagged<
//   "GenericNode",
//   {
//     value: T;
//     left: GenericTree<T>;
//     right: GenericTree<T>;
//   }
// >;

// type GenericTree<T> = GenericLeaf<T> | GenericNode<T>;

type None = Tagged<"None">;
type Just<T extends Record<PropertyKey, unknown>> = Tagged<"Just", T>;
type Maybe<T extends Record<PropertyKey, unknown>> = Just<T> | None;

// const JustString = Tag<Just<{ val: string }>>("Just")({ val: "test" });

const None = Tag<None>("None");
const Just = <T extends Record<PropertyKey, unknown>>(arg: T): Just<T> => {
  // type InnerJust = Tagged<"Just", T>;
  const JustStr = "Just"
  const res =  Tag<Tagged<"Just", T>>(JustStr)(arg);
  return res
};

const MaybeString: Maybe<{ val: string }> = Just<{ val: string }>({ val: "dog" });

type Leaf = Tagged<"Leaf">;
type Node = Tagged<
  "Node",
  {
    value: string;
    left: Tree;
    right: Tree;
  }
>;

type Tree = Leaf | Node;

const Leaf = Tag<Leaf>("Leaf");
const Node = Tag<Node>("Node");

// type TaggedUnionPattern<TUnion extends Tagged<string, AnyObject>> = TUnion extends Tagged<infer Label extends string, AnyObject>
//   ? Tagged<Label, Exclude<TUnion, SymbolForTag>>
//   : never;

// type ExtractBindsFromTaggedUnion<
//   TUnion extends Tagged<string, AnyObject>,
//   TPattern /* extends TaggedUnionPattern<TUnion>*/
// > = Extract<TUnion, Resolve<TPattern>> extends Tagged<string, infer T>
//   ? TPattern extends Tagged<string, infer TTaggedPattern>
//     ? [T, TTaggedPattern, ExtractBinds<T, TTaggedPattern>]
//     : never
//   : never;

// const AnyNode = Node({ value: _("value"), left: _("left"), right: _("right") });
// type AnyNode = typeof AnyNode;

// type Resolved = Resolve<AnyNode>;
// type Extracted = ExtractBindsFromTaggedUnion<Tree, AnyNode>;
// type UnFlat = ExtractBinds<
//   {
//     [SymbolForTag]: "Node";
//     value: string;
//     left: Tree;
//     right: Tree;
//   },
//   {
//     [SymbolForTag]: "Node";
//     value: PredicateBind<"value", any>;
//     left: PredicateBind<"left", any>;
//     right: PredicateBind<"right", any>;
//   }
// >;

// type ExtendsTest = KVPair<"left", Tree> extends KVPair<PropertyKey, infer Nested extends KVPair<PropertyKey, unknown>>
//   ? Nested
//   : false;

// type Keyof<T> = keyof T

// type UnionLeaf = ObjectToUnion<Leaf>;
// type UnionNode = ObjectToUnion<Node>;
// type UnionTree = UnionLeaf | UnionNode;

// type Keys = AnyKey<{x: 1, y: 2} | {x: "a"}>

// type Intersection = UnionToIntersection<{x: 1, y: 2} | {x: "a"}>
// type Merged = MergeUnionOfObjects<Tree>
// type Union = ObjectToUnion<Tree>;
// // type ExtendsTest3 = KVPair<"left", Tree> extends Union ? true : false;
// type Union1 = ObjectToKVUnion<Tree>;
// type Union2 = ObjectToObjectUnion<Tree>;
// type FlatUnion1 = FlattenUnion<ObjectToUnion<{ x: 1; y: "b"; z: { a: 2 } }>>;
// type ExtendsTest2 = Tree extends Union ? true : false;
// type FlatUnion2 = FlattenUnion<Union>;
// type FlatUnion3 = FlattenUnion<KVPair<"left", Tree>>;
// type FlatUnion4 = FlattenUnion<KVPair<"left", "left">>;
// type Flat2 = KVPairUnionToObject<FlatUnion2>;
// type Flat = ObjectToUnion<UnFlat>;
// type Merged2 = MergeUnionOfObjects<Flat>
// type Flattened = FlattenBindObject<Merged2>
// type Merged3 = MergeUnionOfObjects<Flattened>
// type Fail = ExtractObjectBindsHelper<{ [SymbolForTag]: "Node"; value: string; left: Tree; right: Tree; }, PredicateBind<string, any>>
// type FailStart = ExtractObjectBindsHelper<{ [SymbolForTag]: "Node"; value: string; left: Tree; right: Tree; }, any>
// type Fail2 = ObjectToUnion<FailStart>
// type Fail3 = ObjectToUnion<ExtractObjectBindsHelper<{ [SymbolForTag]: "Node"; value: string; left: Tree; right: Tree; }, any>>
// const Leaf = Tag<Leaf>("Leaf").bind(null, {});
// const Node = Tag<Node>("Node");

// const l = Leaf();
// const inOrderTraversal = (tree: Tree): string => {
//   const res: string = match(tree)
//     .against(Leaf(), () => "")
//     .against(Node({ value: _("value"), left: _("left"), right: _("right") }), ({ value, left, right }) => {
//       return inOrderTraversal(left) + value + inOrderTraversal(right);
//     })
//     .against(_, () => "oops")
//     .exhaustive();
//   return res;
// };

const inOrderTraversal = (tree: Tree): string => {
  return match(tree)
    .against(Leaf(), () => "")
    .against(Node({ value: _("value"), left: _("left"), right: _("right") }), ({ value, left, right }) => {
      return inOrderTraversal(left) + value + inOrderTraversal(right);
    })
    .exhaustive();
};
