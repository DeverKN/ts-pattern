import { _ } from "../code/binds";
import { match } from "../code/matcher";
import { ExtractObjectBindsHelper } from "../types/extract";
import { AnyObject } from "../types/helpers/AnyObject";
import { EmptyObject } from "../types/helpers/EmptyObject";
import { MergeUnionOfObjects } from "../types/helpers/flatten";
import { Resolve } from "../types/resolve";
import { GenericTag1, GenericTags1 } from "./GenericTuple/GenericTag1";
import { GenericTags2 } from "./GenericTuple/GenericTag2";
import { Tagged, Tag, Untag, Tags, TaggedCreator, InferGenericType, UNSAFE_TagsArray, TagsWithEmptyConstructors } from "./taggedUnion";

const Identity = <T>(arg: T) => arg;

type TupleCreator<T extends unknown[]> = (...args: T) => T;

// type Create = TupleCreator<[number, number]>

// export const SymbolForTag = Symbol("Tag");
// export type SymbolForTag = typeof SymbolForTag;

// export const SymbolForTagBase = Symbol("TagBase");
// export type SymbolForTagBase = typeof SymbolForTagBase;

// export const SymbolForIsPattern = Symbol("IsPattern");
// export type SymbolForIsPattern = typeof SymbolForIsPattern;

// export type TaggedTuple<TTag extends string, T extends AnyArray | Pattern<AnyArray> = []> = T & { [SymbolForTag]: TTag };

const TaggedPOJO = <TObject extends AnyObject, TTagKey extends keyof TObject, TTag = TObject[TTagKey]>(
  tagKey: TTagKey,
  tag: TTag
) => {
  return (obj: Omit<TObject, TTagKey>) => {
    Object.assign(obj, {
      [tagKey]: tag,
    });
  };
};

// export type TaggedObject<TTag extends string, T extends AnyObject = EmptyObject> = T extends EmptyObject
//   ? { [SymbolForTag]: TTag }
//   : HardMergeObjects<T, { [SymbolForTag]: TTag }>;

// type TaggedPattern<TTag extends string, T = never> = {
//   [SymbolForTag]: TTag;
//   [SymbolForTagBase]: T;
//   //[SymbolForIsPattern]: true;
// };

// type UntagHelper<T extends Tagged<string, unknown>> =
// type AnyTagged<TTag extends string> = Tagged<TTag, T> | TaggedTuple<TTag, T>

// type EmptyTagCreator<TTag extends string> = () => Tagged<TTag>;
// type TaggedObjectCreator<TTag extends string, T extends AnyObject> = /*T extends EmptyObject
//   ? EmptyTagCreator<TTag>
//   : */ <TInstance extends T | Pattern<T>>(...arg: T extends EmptyObject ? [] : [TInstance]) => TaggedObject<TTag, TInstance>;

// type TaggedTupleCreator<TTag extends string, T extends AnyArray> = /*T extends EmptyObject
//   ? EmptyTagCreator<TTag>
//   : */ <TInstance extends T | Pattern<T>>(...arg: T extends [] ? [] : [TInstance]) => TaggedTuple<TTag, TInstance>;

// export function Tag<T extends TaggedTuple<string, AnyArray>>(
//   tag: T extends TaggedTuple<infer TTag extends string, AnyArray> ? TTag : never
// ): T extends TaggedTuple<infer TTag, AnyArray> ? TaggedTupleCreator<TTag, Shift<T>> : never;

// export function Tag<T extends TaggedObject<string, AnyObject>>(
//   tag: T extends TaggedObject<infer TTag extends string, AnyObject> ? TTag : never
// ): T extends TaggedObject<infer TTag, infer TObj> ? TaggedObjectCreator<TTag, Omit<T, SymbolForTag>> : never;

// export function Tag<T extends Tagged<string, unknown>>(
//   tag: T extends Tagged<infer TTag extends string, unknown> ? TTag : never
// ): T extends Tagged<infer TTag, infer TBase> ? TaggedCreator<TTag, TBase> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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

// type None = Tagged<"None">;
// type Just<T> = Tagged<"Just", T>;
// type Maybe<T> = Just<T> | None;

// const Just =
//   <T>() =>
//   <TInstance extends Untag<Just<T>>>(arg: TInstance) =>
//     Tag<Just<T>>("Just")(arg);

// const None = Tag<None>("None");
// const Just =
//   <T>() =>
//   <TInstance extends Untag<Just<T>>>(arg: TInstance) =>
//     Tag<Just<T>>("Just")(arg);

type Point = Tagged<"Point", [x: number, y: number]>;

const Point = Tag<Point>("Point");

// const ZeroZero = Point(1, 2);

// type Test = Point extends TaggedTuple<any, any> ? true : false;
// Extr
// type Binds = ExtractBinds<[1, 2], [PredicateBind<"x", any>, PredicateBind<"y", any>]>;
const moveForward = (point: Point) => {
  match(point)
    .against(Point(_("x"), _("y")), ({ x, y }) => Point(x + 1, y + 1))
    .exhaustive();
};

// const JustString = Tag<Just<{ val: string }>>("Just")({ val: "test" });

// const None = Tag<None>("None");
// const Just = <T>(arg: T): Just<T> => {
//   // type InnerJust = Tagged<"Just", T>;
//   return Tag<Just<T>>(JustStr)(arg);
// };

// const MaybeString: Maybe<{ val: string }> = Just<{ val: string }>({ val: "dog" });

type GenericLeaf = Tagged<"GenericLeaf", EmptyObject>;
type GenericNode<T> = Tagged<
  "GenericNode",
  {
    value: T;
    left: GenericTree<T>;
    right: GenericTree<T>;
  }
>;

type GenericTree<T> = GenericLeaf | GenericNode<T>;

const GenericLeaf = Tag<GenericLeaf>("GenericLeaf");
const GenericNode = <T>(arg: Untag<GenericNode<T>>) => arg; //Tag<GenericNode<T>>("GenericNode")(arg);

// const preOrderTraversal = <T>(tree: GenericTree<T>): string => {
//   return match(tree)
//     .against(GenericLeaf(), () => "")
//     .against(GenericNode<T>({ value: _("val"), left: _("left"), right: _("right") }), ({ val, left, right }) => {
//       return `${val},${preOrderTraversal(left)},${preOrderTraversal(right)}`;
//     })
//     .exhaustive();
// };

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

// type NumberLeaf = Tagged<"NumberLeaf">;
// type NumberNode = Tagged<
//   "NumberNode",
//   {
//     value: number;
//     left: NumberTree;
//     right: NumberTree;
//   }
// >;

// type NumberTree = NumberLeaf | NumberNode;
// const NumberLeaf = Tag<NumberLeaf>("NumberLeaf");
// const NumberNode = Tag<NumberNode>("NumberNode");

// const NumberPattern = NumberNode({ value: _("value"), left: _("left"), right: _("right") });

type EitherFake<A, B> = Tagged<"EitherFake", A | B>;

// type TestNode = Kind<"Node", string>;

// const GenericTag =
//   <URI extends keyof URIToKind<unknown>, TagName extends UnknownHTK[SymbolForTag], UnknownHTK extends Tagged<string, unknown> = Kind<URI, unknown>>(tagName: TagName) =>
//   <T>() =>
//   <TInstance extends ParameterizedHKT | Pattern<ParameterizedHKT>, ParameterizedHKT = Kind<URI, T>>(instance: TInstance): Tagged<TagName, TInstance> => {
//     // type HTKInstance = Kind<URI, T>
//     // type InstanceTagName = HTKInstance[SymbolForTag]
//     return Tag<UnknownHTK>(tagName)(instance);
//   };

declare module "./GenericTuple/GenericTag2" {
  interface URIToKind2<A, B> {
    EitherFake: EitherFake<A, B>;
  }
}

// const EitherFake = GenericTag2<"EitherFake">("EitherFake");

// type Leaf = Tagged<"Leaf">;
// type Node<T> = Tagged<
//   "Node",
//   {
//     value: T;
//     left: Tree<T>;
//     right: Tree<T>;
//   }
// >;

// type Tree<T> = Leaf | Node<T>;

type Tree<T> = Tagged<"Leaf"> | Tagged<"Node", { value: T; left: Tree<T>; right: Tree<T> }>;

// declare module "./GenericTuple/GenericTag1" {
//   interface URIToKind1<A> {
//     Tree: Tree<A>;
//   }
// }

const { Leaf, Node } = TagsWithEmptyConstructors<Tree<InferGenericType>>()("Node","Leaf")(true, false);

// const test = Leaf()
// const 
// const Leaf = Tag<Leaf>("Leaf");
// const Node =
//   <T>() =>
//   <TInstance extends Untag<Node<T>>>(arg: TInstance) =>
//     Tag<Node<T>>("Node")(arg);
// const Node = GenericTag<"Node">;

// interface URIToKind<T> {
//   __never__: never;
// }

// const StringNode = Node<string>();

// type Node = Extract<Tree<number>, Tagged<"Node", unknown>>;
// type Test = TaggedCreator<"Node", Untag<Node>>;
// const NumberNode = Node<number>()
// const TestNode = Node<number>()({
//   left: Leaf(),
//   right: Leaf(),
//   value: _,
// });

// const patternObj = { value: _("value"), left: _("left"), right: _("right") };
// const I = Identity(patternObj);
// type PatternObjType = typeof patternObj;
// const Pattern = StringNode(patternObj);
// type StringTree = Tree<string>;
// type PatternType = typeof Pattern;
// type Pt = PatternType[SymbolForTagBase];
// type TaggedPatternInstance = TaggedPattern<"Node", PatternObjType>;
// type Test = Pt extends Pattern<Tree<string>> ? true : false;
// type ExtractedPattern = Extract<PatternType, TaggedPatternInstance>;

// type Extracted = ExtractBindsFromTagged<Tree<string>, PatternType>;

// type Err = MergeUnionOfObjects<
//   ExtractObjectBindsHelper<
//     { value: string; left: Tree<string>; right: Tree<string> },
//     { value: string; left: Tree<string>; right: Tree<string> }
//   >
// >;

const inOrderTraversal = <T extends string | number>(tree: Tree<T>): string => {
  return match(tree)
    .against(Leaf, () => "")
    .against(Node({ value: _("value"), left: _("left"), right: _("right") }), ({ value, left, right }) => {
      return `${inOrderTraversal(left)}${value}${inOrderTraversal(right)}`;
    })
    .exhaustive();
};

// type Either<A, B> = Left<A> | Right<B>;
// type Left<A> = Tagged<"Left", A>;
// type Right<B> = Tagged<"Right", B>;

type Either<A, B> = Tagged<"Left", A> | Tagged<"Right", B>;

// declare module "./GenericTuple/GenericTag2" {
//   interface URIToKind2<A, B> {
//     Either: Either<A, B>;
//   }
// }

const { Left, Right } = UNSAFE_TagsArray<Either<InferGenericType, InferGenericType>>("Left", "Right");

// const Left = GenericTag1<"Left">("Left");
// const Right = GenericTag1<"Right">("Right");

const StringOrNumber: Either<string, number> = Left("test");

// type User = Student | Teacher;
// type Student = Tagged<
//   "Student",
//   {
//     name: string;
//     age: number;
//     gpa: number;
//   }
// >;

// type Teacher = Tagged<
//   "Teacher",
//   {
//     name: string;
//     salary: number;
//     yearsOfExperience: number;
//   }
// >;

// const Student = Tag<Student>("Student");
// const Teacher = Tag<Teacher>("Teacher");

type User =
  | Tagged<"Student", { name: string; gpa: number; age: number }>
  | Tagged<"Teacher", { name: string; salary: number; yearsOfExperience: number }>;

const { Student, Teacher } = Tags<User>()("Student", "Teacher");

const StudentPattern = Student({ name: _("name"), age: _, gpa: _("gpa") });
type Resolved = Resolve<typeof StudentPattern>;

const greetUser = (user: User) => {
  match(user)
    .against(Student({ name: _("name"), age: _, gpa: _("gpa") }), ({ name, gpa }) => `Hello ${name} you have a GPA of ${gpa}`)
    .against(Teacher({ name: _("name"), salary: _, yearsOfExperience: _("years") }), ({ name, years }) => {
      return `Hello ${name} congrats on ${years} years of service!`;
    })
    .exhaustive();
};

// type List<T> = Empty | Cons<T>;
// type Empty = Tagged<"Empty">;
// type Cons<T> = Tagged<"Cons", [T, List<T>]>;

// declare module "./GenericTuple/GenericTag1" {
//   interface URIToKind1<A> {
//     Cons: Cons<A>;
//   }
// }

// const Empty = Tag<Empty>("Empty");
// const { Cons, Empty } = Tags<List<InferGenericType>>()("Cons", "Empty");

// const ConsNum = Cons(1, Empty());
// const sum: (list: List<number>) => number = flowMatch<List<number>, number>()
//   .against(Empty(), () => 0)
//   .against(ConsNum(_("x"), _("xs")), ({ x, xs }) => x + sum(xs))
//   .exhaustive();

// const Throw = (e: Error) => {
//   throw e;
// };

// const unwrap = <T>(maybeVal: Maybe<T>) =>
//   match(maybeVal)
//     .against(None(), () => Throw(Error("Invalid: Attempted unwrap of None value")))
//     .against(Just<T>()(_("val")), ({ val }) => val)
//     .exhaustive();

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
// const concat =
//   <S extends string>(s: S) =>
//   <T extends string>(t: T): `${S}${T}` =>
//     (s + t) as any;

// const mapped = map(Just<string>()("test"), concat("pre"))
// const unwrapped = unwrap(mapped)

// type LeftTest<A> = A
// type RightTest<B> = B

// type JustTest<A> = Tagged<"Just", A>

// type URIMap<A> = {
//   // Left: LeftTest<A>,
//   // Right: RightTest<B>,
//   Just: Tagged<"Just", A>;
//   None: Tagged<"None">;
// };

// type URIs = keyof URIMap<unknown>;

// type IsGeneric<URI extends URIs> = URIMap<number>[URI] extends URIMap<string>[URI] ? false : true;

// type IsGenericTrue = IsGeneric<"Just">;
// type IsGenericFalse = IsGeneric<"None">;

// type URIMap2<A, B> = {
//   Left: Tagged<"Left", A>;
//   Right: Tagged<"Right", B>;
//   Either: Tagged<"Either", [A, B]>;
// };

// type CurriedURIMap<A> = <B>() => URIMap2<A, B>;

// type Test5 = ReturnType<CurriedURIMap<string><>>
// type URIs2 = keyof URIMap2<unknown, unknown>;

// const SymbolForMissingGenericType = Symbol("MissingGenericType");
// type MissingGenericType = { [SymbolForMissingGenericType]: true };
// type VariadicGeneric2Helper<URI extends URIs2, GenericsArray = unknown[]> = IsGeneric2<URI>
// type VariadicGeneric2<URI extends URIs2, A = MissingGenericType, B = MissingGenericType> = IsGeneric2<URI> extends [true, true] ? URIMap2<A, B>[URI] :
// IsGeneric2<URI> extends [true, false] ? URIMap2<A, unknown>[URI] :
// IsGeneric2<URI> extends [false, true] ? URIMap2<unknown, A>[URI] :
// IsGeneric2<URI> extends [false, false] ? URIMap2<unknown, unknown>[URI] : never

// type IsGenericForA<URI extends URIs2> = URIMap2<number, unknown>[URI] extends URIMap2<string, unknown>[URI] ? false : true
// type IsGenericForB<URI extends URIs2> = URIMap2<unknown, number>[URI] extends URIMap2<unknown, string>[URI] ? false : true
// type IsGeneric2<URI extends URIs2> = [IsGenericForA<URI>, IsGenericForB<URI>]
// type IsGenericForATrue = IsGenericForA<"Left">
// type IsGenericForAFalse = IsGenericForA<"Right">

// type LeftTest = VariadicGeneric2<"Left", string>
// type RightTest = VariadicGeneric2<"Right", number>
// type EitherTest = VariadicGeneric2<"Either", number>

// type Never = Where<"Never", [number, string]>