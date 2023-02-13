import { AnyBind, PredicateBind, string as s } from "./bind";

type ReverseNormal<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest extends never[]
    ? [First]
    : [...ReverseNormal<Rest>, First]
  : [];
type ReverseReadonly<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? Rest extends readonly never[]
    ? [First]
    : [...ReverseReadonly<Rest>, First]
  : [];

type Reverse<T extends readonly any[] | any[]> = T extends readonly any[]
  ? ReverseReadonly<T>
  : T extends any[]
  ? ReverseNormal<T>
  : never;

const reversed = <T extends readonly any[]>(arr: T): Reverse<T> => {
  const [first, ...rest] = arr;
  return [...reversed(rest), first] as Reverse<T>;
};

type Extends<T, U> = T extends U ? true : false;

type IgnoreAny<T, U> = [Exclude<any, T>] extends [never] ? U : T;

type PickSpecific<T, U> = U extends T ? (T extends U ? IgnoreAny<T, U> : IgnoreAny<U, T>) : IgnoreAny<T, U>;

// type Specific = PickSpecific<string, 12>
// type Test = Extends<string, "dog">

const reversedNums = reversed([1, 2, 3] as const);

type UnionToObject<T extends string | number | symbol> = {
  [k in T]: k;
};

// type ElementOf<T> = T extends (infer E)[] ? E : T;

type Input = {
  name: "Dever" | "Nathaniel";
  age: 21 | 16;
};

type Output =
  | {
      name: "Dever";
      age: 21;
    }
  | {
      name: "Dever";
      age: 16;
    }
  | {
      name: "Dever";
      age: 21;
    }
  | {
      name: "Dever";
      age: 16;
    };
// type Union = "a" | "b" | "c";

// type abc = UnionToIntersection<Union>
// type t = TuplifyUnion<Union>; // ["a", "b", "c"]

// type test = UnionToObject<Union>;

type Rows = "person";
type Fields = "id" | "name";
type MakeFields<TRow extends Rows> = `${TRow}.${Fields}`;
type AsType<
  TRow extends Rows,
  TField extends MakeFields<TRow>,
  TQuery extends string
> = TQuery extends `${TField} as ${infer TAlias}` ? TAlias : never;
type Test = AsType<"person", "person.id", "person.id as person_id">;

type Parse<T extends string> = T extends `"${infer Val extends string}"`
  ? Val
  : T extends `${infer Val extends number}`
  ? Val
  : T extends `${infer Val extends boolean}`
  ? Val
  : T extends `${infer Val extends bigint}`
  ? Val
  : T extends `${infer Val extends null}`
  ? Val
  : T extends `${infer Val extends undefined}`
  ? Val
  : T extends `[${infer Vals}]`
  ? ParseArrHelper<Vals>
  : T extends `{${infer Vals}}`
  ? ObjectHelper<Vals>
  : never;

type ParseArrHelper<
  // T extends string | number | bigint | boolean | null | undefined,
  TArr extends string
> = TArr extends ""
  ? []
  : TArr extends `${infer First},${infer Rest}`
  ? [Parse<First>, ...ParseArrHelper<Rest>]
  : TArr extends `${infer First}`
  ? [Parse<First>]
  : never;

type MergeObjects<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T ? T[K] : K extends keyof U ? U[K] : never;
};

type KVObject<K extends string, V> = {
  [k in K]: V;
};

type ObjectHelper<
  // T extends string | number | bigint | boolean | null | undefined,
  TObj extends string
> = TObj extends ""
  ? {}
  : TObj extends `${infer Key}:{${infer Inner}},${infer Rest}`
  ? MergeObjects<KVObject<Key, ObjectHelper<Inner>>, ObjectHelper<Rest>>
  : TObj extends `${infer Key}:${infer Val},${infer Rest}`
  ? MergeObjects<KVObject<Key, Parse<Val>>, ObjectHelper<Rest>>
  : TObj extends `${infer Key extends string}:${infer Val}`
  ? KVObject<Key, Parse<Val>>
  : never;

type Test2<TObj extends string> = TObj extends `${infer Key}:${infer Val},${infer Rest}`
  ? Rest
  : TObj extends `${infer Key extends string}:${infer Val}`
  ? [Key, Val]
  : false;

type Test3 = Test2<"test:5,other:5">;
type ParseArr<
  // T extends string | number | bigint | boolean | null | undefined,
  TArr extends string
> = TArr extends `[${infer Vals}]` ? ParseArrHelper<Vals> : [];

// type Parsed = Parse<"null">;
type ParsedArr = ObjectHelper<"test:5,other:{x:5,y:5},last:5">;

type Merge<TStrings extends readonly any[], TBinds extends PredicateBind<any, string>[]> = TStrings extends readonly [
  infer StringsFirst,
  ...infer StringsRest
]
  ? TBinds extends [infer BindsFirst, ...infer BindsRest extends PredicateBind<any, string>[]]
    ? [StringsFirst, BindsFirst, ...Merge<StringsRest, BindsRest>]
    : []
  : [];
const string = <TStrings extends readonly any[], TBinds extends PredicateBind<any, string>[]>(
  strings: TStrings,
  ...binds: TBinds
): Merge<TStrings, TBinds> => {
  return [strings, binds] as any;
};

const test = string`hello ${s("name")}`;

type Options = [msg: "", err: true] | [msg: string, err: false];
type ExtractAndGet<TResPattern extends any> = Extract<Options, TResPattern>;

type NoError = ExtractAndGet<[msg: "", err: false]>;

type UnionOfObjectsToObjectOfUnions<U> = {
  [K in keyof U]: TuplifyUnion<U[K]>;
};

type KVPair<K, V> = {
  K: K;
  V: V;
};

type ValueOf<T> = T[keyof T];

type ObjectToKVPairs<O> = TuplifyUnion<
  ValueOf<{
    [K in keyof O]: KVPair<K, TuplifyUnion<O[K]>>;
  }>
>;

type ObjectToKVPairsDeepHelper<O> = TuplifyUnion<
  ValueOf<{
    [K in keyof O]: O[K] extends Record<any, any> ? KVPair<K, ObjectToKVPairsDeep<O[K]>> : KVPair<K, TuplifyUnion<O[K]>>;
  }>
>;

type ObjectToKVPairsDeep<O> = ObjectToKVPairsDeepHelper<O>;

type ObjectToKVPairsUnion<O> = ValueOf<{
  [K in keyof O]: KVPair<K, O[K]>;
}>;

type ObjectToKVObjectsUnion<O> = ValueOf<{
  [K in keyof O extends string ? keyof O : never]: KVObject<K, O[K]>;
}>;

type ObjectToKVObjectsTuple<O> = TuplifyUnion<
  ValueOf<{
    [K in keyof O extends string ? keyof O : never]: KVObject<K, O[K]>;
  }>
>;

// oh boy don't do this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>;

type ExtractArray<T, U> = U extends [infer First, ...infer Rest]
  ? First extends T
    ? First | ExtractArray<T, Rest>
    : never
  : never;
type WeirdExtract<T, U> = ExtractArray<T, TuplifyUnion<U>>;

type Extracted = WeirdExtract<{ x: 1; y: any }, { x: 3; y: 2 } | { x: 1 | 2; y: 0 }>;

// type KVObject<K, V> = {
//   [key in K]: V
// }

// type MergeObjects<T, U> = {
//   [K in keyof T | keyof U]: K extends keyof T ? T[K] : K extends keyof U ? U[K] : never;
// };

type MakeKVObjectsFromArr<K extends string, V extends any[]> = V extends [infer FirstV, ...infer RestV]
  ? KVObject<K, FirstV> | MakeKVObjectsFromArr<K, RestV>
  : never;

type KVPairsToObjectLoose<KVPairs extends any> = KVPairs extends [
  KVPair<infer K extends string, infer V extends any[]>,
  ...infer Rest extends KVPair<string, any>[]
]
  ? MakeKVObjectsFromArr<K, V> & KVPairsToObjectLoose<Rest>
  : {};

// type GetPairs<O extends Record<string, any>> = ObjectToKVPairs<O>
// type ObjectToDiscriminated<O extends Record<string, any>> = KVPairsToObject<GetPairs<O>>

type Objs = MakeKVObjectsFromArr<"x", [1, 2, 3]>;
type Pairs = ObjectToKVPairs<{ x: 1 | 2; y: 2 }>;
type Reconstructed = KVPairsToObjectLoose<Pairs>;
type Extracted2 = Extract<Reconstructed, { x: 1; y: any }>;
type ObjectTuple = UnionOfObjectsToObjectOfUnions<{ x: 1 | 2; y: 2 }>;

type UnionPairs = ObjectToKVPairsUnion<{ x: 1 | 2; y: 2 }>;
type UnionObjects = ObjectToKVObjectsUnion<{ x: 1 | 2; y: 2 }>;

export type Distribute<T> = KVPairsToObjectLoose<ObjectToKVPairs<T>>;

type DistributeDeepV3<T> = {
  [K in keyof T]: T[K] extends Record<any, any> ? Distribute<T[K]> : T[K];
};

// type DistributedDeep = DistributeDeepV3<{ x: 1 | 2; y: 2, z: {a: "b" | "c"} }>;

// type KVUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type KVUnionToIntersection<U> = U extends KVPair<infer K, infer V> ? [K, V] : never;
type IntersectionPairs = KVUnionToIntersection<UnionPairs>;
type UnionReconstructed = UnionKVPairsToObjectHelper<UnionPairs>;
// type Keys = keyof UnionReconstructed
// type UnionReconstructedValues = UnionReconstructed[Keys];
type IntersectionReconstructed = UnionToIntersection<UnionReconstructed>;
// type K = KVObject<"x", 1>["x"]
// type Test = UnionReconstructed[""]
type MergedReconstructed = KVObjectsToObjects<UnionReconstructed>;
type Keys<T> = T extends Record<infer Keys, any> ? Keys : never;
// type TupleMerged = TuplifyUnion<UnionObjects>
type ObjectMerged = MergeUnionOfKVObjects<UnionObjects>;

type UnionTuple = TuplifyUnion<UnionObjects>;

type Pls = KVObjectsToObject<UnionTuple>;

type DistributeUnionObject<T> = KVObjectsToObjectLoose<ObjectToKVObjectsTuple<T>>;

type DeepObject = { x: 1 | 2; y: 2; z: { a: "b" | "c" } };
type Distributed = Distribute<DeepObject>;

type DeepPairs = ObjectToKVPairsDeep<DeepObject>;

type ShallowReconstructed = KVPairsToObjectLoose<ObjectToKVPairs<DeepObject>>; //[""]
type DeepReconstructed = KVPairsToObjectLooseDeep<DeepPairs>;

// type DeepFixed = ReconstructedObjToPOJO<DeepReconstructed>[""]

type ReconstructedObjToPOJO<O> = {
  [K in keyof O]: O[K] extends Record<any, any> ? ReconstructedObjToPOJO<O[K]> : O[K];
};

type DeepKeys = keyof DeepReconstructed;

// type IntersectionToObject<T> = {

type DistributeInnerUnion<T> = ValueOf<{
  [K in keyof T]: K extends string
    ? MergeUnionObjects<KVObject<K, T[K]>, Pick<T, Exclude<keyof T, K>>> | DistributeInnerUnion<Pick<T, Exclude<keyof T, K>>>
    : never;
}>;

type KeysArr<T> = TuplifyUnion<keyof T>;

type KeysToDistributedObject<T extends Record<string, any>, Keys> = Keys extends [infer K extends string, ...infer Rest]
  ? T[K] extends Record<string, any>
    ? [[K, ObjToDistributedObject<T[K]>], ...KeysToDistributedObject<T, Rest>]
    : [[K, TuplifyUnion<T[K]>], ...KeysToDistributedObject<T, Rest>] //MergeUnionObjects<KVObject<K, T[K]>, KeysToDistributedObject<T, Rest>>
  : [];

type KeysToDistributedObjectAlt<T extends Record<string, any>, Keys> = Keys extends [infer K extends string, ...infer Rest]
  ? [KVObject<K, T[K]>, ...KeysToDistributedObjectAlt<T, Rest>]
  : [];

type UnionObj = { a: 1; b: { x: 1; y: 2 } | { x: 1; y: 3 } };
type KeysOfUnion = KeysArr<UnionObj>;

type KeysToKVPairsHelper1<T extends Record<string, any>, Keys> = Keys extends [infer K extends string, ...infer Rest]
  ? T[K] extends Record<string, any>
    ? [KVPair<K, KeysToKVPairsHelper2<T[K]>>, ...KeysToKVPairsHelper1<T, Rest>]
    : [KVPair<K, TuplifyUnion<T[K]>>, ...KeysToKVPairsHelper1<T, Rest>] //MergeUnionObjects<KVObject<K, T[K]>, KeysToDistributedObject<T, Rest>>
  : [];

// type ObjToDistributedObjectV3<T extends Record<string, any>> = KVArrToObj<KeysToDistributedObject<T, KeysArr<T>>>;

type KeysToKVPairsHelper2<T extends Record<string, any>> = KeysToKVPairsHelper1<T, KeysArr<T>>;

type KeysToKVPairs<T extends Record<string, any>> = KeysToKVPairsHelper1<T, KeysArr<T>>;

type ObjToDistributedObjectV2<T extends Record<string, any>> = KVArrToObj<KeysToDistributedObject<T, KeysArr<T>>>;
type ObjToDistributedObject<T extends Record<string, any>> = KeysToDistributedObject<T, KeysArr<T>>;
type ObjToDistributedObjectAlt<T extends Record<string, any>> = [KeysArr<T>, KeysToDistributedObjectAlt<T, KeysArr<T>>];
type DistributedUnion2 = ObjToDistributedObjectAlt<UnionObj>;

type DistributedUnion = DistributeInnerUnion<UnionObj>;
type UnionBase = { a: 1; b: { x: 1; y: 2 | 3 } };
type b = UnionBase["b"];
type UnionRef = { a: 1; b: { x: 1; y: 2 } } | { a: 1; b: { x: 1; y: 3 } };

type MergeArrObjectsV2<U, T> = U extends [infer First, ...infer Rest]
  ? [MergeObjects<First, T>, ...MergeArrObjectsV2<Rest, T>]
  : [];
type MergeUnionObjectsV2<U, T> = MergeArrObjectsV2<TuplifyUnion<U>, T>[number];

// type y = UnionRef[""]
type ABMerged = MergeUnionObjects<{ b: { x: 1; y: 2 } | { x: 1; y: 3 } }, { a: 1 }>;
type UnionAsArr = [{ b: { x: 1; y: 2 } }, { b: { x: 1; y: 3 } }];

type ComputedUnionAsArr = TuplifyUnion<{ b: { x: 1; y: 2 } } | { b: { x: 1; y: 3 } }>;

type UnionPropsToUnionObjects<T> = {};

type ComputedUnionAsArrKV = TuplifyUnion<
  KVObject<
    "b",
    | {
        x: 1;
        y: 2;
      }
    | {
        x: 1;
        y: 3;
      }
  >
>;

type isSameArr = ComputedUnionAsArr extends UnionAsArr ? true : never;

type ABMergedArr = MergeArrObjectsV2<UnionAsArr, { a: 1 }>[number];
type ABMergedArrComputed = MergeArrObjectsV2<ComputedUnionAsArr, { a: 1 }>[number];
type ABMergedArrComputedOneShot = KeysToKVPairs<UnionBase>;

type ComputedRes = [
  [
    "b",
    [
      {
        x: 1;
        y: 2;
      },
      {
        x: 1;
        y: 3;
      }
    ]
  ],
  ["a", [1]]
];

type ComputedRes2 = [["b", [["x", [1]], ["y", [2, 3]]]], ["a", [1]]];
type ComputedRes3 = [KVPair<"b", [KVPair<"x", [1]>, KVPair<"y", [2, 3]>]>, KVPair<"a", [1]>];
type ComputedRes3GoalMid = [KVPair<"b", [[KVPair<"x", [1]>, KVPair<"y", [2]>], [KVPair<"x", [1]>, KVPair<"y", [3]>]]>, KVPair<"a", [1]>];
type ComputedRes3GoalMid2 = [[KVPair<"b", [KVPair<"x", [1]>, KVPair<"y", [2]>]>, KVPair<"b", [KVPair<"x", [1]>, KVPair<"y", [3]>]>], KVPair<"a", [1]>];
type ComputedRes3GoalFinal = [[KVPair<"a", [1]>, KVPair<"b", [KVPair<"x", [1]>, KVPair<"y", [2]>]>], [KVPair<"a", [1]>, KVPair<"b", [KVPair<"x", [1]>, KVPair<"y", [3]>]>]];

type ConvertKVPairsArrayToObjectHelperValues<K extends string, T, Rest> = T extends [infer FirstVal, ...infer RestVals]
  ?
      | MergeObjects<KVObject<K, FirstVal>, ConvertKVPairsArrayToObject<Rest>>
      | ConvertKVPairsArrayToObjectHelperValues<K, RestVals, Rest>
  : never;

// type ConvertKVPairsArrayToObjectHelperObject<K extends string, T extends KVPair<any, any>[], Rest> = T extends [
//   infer FirstVal,
//   ...infer RestVals
// ]
//   ?
//       | MergeObjects<KVObject<K, ConvertKVPairsArrayToObject<FirstVal>>, ConvertKVPairsArrayToObject<Rest>>
//       | ConvertKVPairsArrayToObjectHelperValues<K, RestVals, Rest>
//   : never;

type ConvertKVPairsArrayToObjectHelper<K extends string, T, Rest> = T extends KVPair<any, any>[]
  ? KVObject<K, ConvertKVPairsArrayToObject<T>>
  : ConvertKVPairsArrayToObjectHelperValues<K, T, Rest>;

type ConvertKVPairsArrayToObject<T> = T extends [KVPair<infer K extends string, infer V>, ...infer Rest]
  ? ConvertKVPairsArrayToObjectHelper<K, V, Rest>
  : {};

type ConvertedObject = ConvertKVPairsArrayToObject<ComputedRes3>["b"]
/*

Schema

Object = (KVPair<K, Object[] | value[]>)[]

three cases
- object case
  - recur
- value case
  - recur with helper
- empty case
  - end
*/

type GenerateObjectsFromKVPairsArr<K extends string, V, Rest> = V extends KVPair<any, any>[]
  ? KVObject<K, KVPairsArrToObj<V>>
  : V extends [infer VFirst, ...infer VRest]
  ? MergeObjects<KVObject<K, VFirst>, KVPairsArrToObj<Rest>> | GenerateObjectsFromKVPairsArr<K, VRest, Rest>
  : never;

type KVPairsArrToObj<T> = T extends [KVPair<infer K extends string, infer V>, ...infer Rest]
  ? GenerateObjectsFromKVPairsArr<K, V, Rest>
  : {};

type GenerateObjectsFromKVArr<K extends string, V, Rest> = V extends [infer VFirst, ...infer VRest]
  ? Rest extends never[]
    ? KVObject<K, VFirst> | GenerateObjectsFromKVArr<K, VRest, Rest>
    : MergeObjects<KVObject<K, VFirst>, KVArrToObj<Rest>> | GenerateObjectsFromKVArr<K, VRest, Rest>
  : never;

type KVArrToObj<T> = T extends [[infer K extends string, infer V], ...infer Rest] ? GenerateObjectsFromKVArr<K, V, Rest> : {};

type Nested = KVArrToObj<ComputedRes>;
type NestedComputed = ObjToDistributedObjectV2<UnionBase>;
type NestedComputed2 = KVPairsArrToObj<ComputedRes3>; //[""];
// type PLSSS = UnionRef extends NestedComputed ? true : never

type isSameDist = ABMergedArr extends UnionRef ? true : never;
type isSameDistComputed = ABMergedArrComputed extends UnionRef ? true : never;
type isSameDistComputedOneShot = ObjToDistributedObject<UnionRef> extends UnionRef ? true : never;

type isSameOr = MergeUnionObjects<KVObject<"x", 1 | 2>, { y: 2 }> extends { x: 1 | 2; y: 2 } ? true : never;

// }
type Reference =
  | { x: 1; y: 2; z: { a: "b" } }
  | { x: 2; y: 2; z: { a: "b" } }
  | { x: 1; y: 2; z: { a: "c" } }
  | { x: 2; y: 2; z: { a: "c" } };
type FlawedReference = { x: 1; y: 2; z: { a: "b" | "c" } } | { x: 2; y: 2; z: { a: "b" | "c" } };
type NestedDistributed = ObjToDistributedObjectV2<DeepObject>;
type x1Ref = Extract<Reference, { x: 1; y: any; z: any }>;
type x1 = Extract<DeepReconstructed, { x: 1; y: any; z: any }>;
// type x = Reference["x"]
type isSame = Extends<DeepReconstructed, Reference>;
type isSameNot = Extends<DeepReconstructed, FlawedReference>;
// type ExcludeDeep<T, U> = any

type MergeArrObjects<U, T> = U extends [infer First, ...infer Rest] ? MergeObjects<First, T> | MergeArrObjects<Rest, T> : never;
type MergeUnionObjects<U, T> = MergeArrObjects<TuplifyUnion<U>, T>;
type Merged = MergeUnionObjects<{ x: 1 } | { x: 2 }, { y: 1 }>;
type MergedEx = Extract<Merged, { x: any; y: 1 }>;
type is2 = Extends<MergedEx, { x: 1; y: 1 } | { x: 2; y: 1 }>;
// type Merged2 = Exclude<MergeObjects<{x: 1} | {x: 2}, {y: 1}>, {x: 2, y: any}>

type AnyFalse<T> = false extends T ? false : true;
type ExtendsDeep<T, U> = T extends Record<any, any>
  ? AnyFalse<
      ValueOf<{
        [K in keyof T]: K extends keyof U ? ExtendsDeep<T[K], U[K]> : false;
      }>
    >
  : Extends<T, U>;

type ExcludeDeep<T, U> = ExtendsDeep<T, U> extends true ? never : T;
type deepTest = Extends<{ x: 1; y: { x: { a: 2 } } }, { x: 1; y: { x: { a: 2 } } }>;

type ExcludedReference = Extract<Exclude<Reference, { x: 1; y: 2; z: { a: "c" } }>, { x: 1; y: any; z: any }>["x"];
type ExcludedActual = Extract<Exclude<DeepReconstructed, { x: 1; y: 2; z: { a: "c" } }>, { x: 1; y: any; z: any }>["z"];

type Current = [KVPair<"x", [1, 2]>, KVPair<"y", [2]>, KVPair<"z", [KVPair<"a", ["b", "c"]>]>];

// type GoalCurrent = [KVPair<"x", [1, 2]>, KVPair<"y", [2]>, [KVPair<"a", ["b", "c"]>]];

// type MakeKVObjectsFromArrToArrDeep<K extends string, V extends any[]> = V extends [infer FirstV, ...infer RestV]
//   ? FirstV extends KVPair<infer Key extends string, infer Val extends any[]>
//     ? MakeKVObjectsFromArrDeep<K, MakeKVObjectsFromArrToArrDeep<Key, Val>>
//     : [KVObject<K, FirstV>, ...MakeKVObjectsFromArrToArrDeep<K, RestV>]
//   : never;

type TestPls = KVPairsToObjectLooseDeep<[KVPair<"a", ["b", "c"]>]>;

type MakeKVObjectsFromArrDeep<K extends string, V extends any[]> = V extends [infer FirstV, ...infer RestV]
  ? FirstV extends KVPair<string, any[]>
    ? KVObject<K, KVPairsToObjectLooseDeep<TuplifyUnion<FirstV>>>
    : KVObject<K, FirstV> | MakeKVObjectsFromArrDeep<K, RestV>
  : never;

type KVPairsToObjectLooseDeep<KVPairs extends any> = KVPairs extends [
  KVPair<infer K extends string, infer V extends any[]>,
  ...infer Rest extends KVPair<string, any>[]
]
  ? Rest extends never[]
    ? MakeKVObjectsFromArrDeep<K, V>
    : MergeUnionObjects<MakeKVObjectsFromArrDeep<K, V>, KVPairsToObjectLooseDeep<Rest>>
  : {};

// type DeepReconstructed = KVObjectsToObjectLoose<DeepObject>;
type excluded = Exclude<Distributed, { x: 1; y: 2 }>;

// type MakeKVObjectsFromArr<K extends string, V extends any[]> = V extends [infer FirstV, ...infer RestV]
//   ? KVObject<K, FirstV> | MakeKVObjectsFromArr<K, RestV>
//   : never;

type KVObjectsToObjectLoose<KVPairs> = KVPairs extends [
  KVObject<infer K extends string, infer V extends any>,
  ...infer Rest extends KVObject<string, any>[]
]
  ? MakeKVObjectsFromArr<K, TuplifyUnion<V>> & KVObjectsToObject<Rest>
  : {};

type KVObjectsToObject<KVPairs extends KVObject<string, any>[]> = KVPairs extends [
  KVObject<infer K extends string, infer V extends any>,
  ...infer Rest extends KVObject<string, any>[]
]
  ? KVObject<K, V> & KVObjectsToObject<Rest>
  : {};

type MergeUnionOfKVObjects<T extends KVObject<any, any>> = {
  [K in Keys<T>]: [K, T[K], T, Extract<T, KVObject<K, any>>];
};

type MergeTupleOfObjects<T> = T extends [infer First, ...infer Rest] ? MergeObjects<First, MergeTupleOfObjects<Rest>> : {};
// type Tuples = TuplifyUnion<UnionObjects>
type MergedKeys = Keys<UnionObjects>["0"];
// type Test3 = UnionObjects[MergedKeys]

type KVObjectsToObjects<U extends KVObject<string, any>> = U extends KVObject<infer Keys, any>
  ? {
      [K in Keys]: Extract<U, KVObject<K, any>> extends KVObject<any, infer Val> ? Val : never;
    }
  : {};

type MergeUnionOfObjectsoObject<U extends KVObject<string, any>> = U extends KVObject<infer Keys, any>
  ? {
      [K in Keys]: Extract<U, KVObject<K, any>> extends KVObject<any, infer Val> ? Val : never;
    }
  : {};

// type Exluded3 = Exclude<IntersectionReconstructed, {x: 1, y: any}>[""]

type MakeKVObjectsFromUnion<K extends string, V extends any> = ValueOf<{
  [Key in V as any]: KVObject<K, Key>;
}>;

type UnionTest = MakeKVObjectsFromUnion<"dog", 1 | 2>;

type UnionKVPairsToObject<KVPairs extends KVObject<string, any>> = ValueOf<UnionKVPairsToObjectHelper<KVPairs>>;

type UnionKVPairsToObjectHelper<KVPairs extends KVObject<string, any>> = KVPairs extends never
  ? {}
  : ValueOf<{
      [K in KVPairs["K"]]: MakeKVObjectsFromUnion<K, Extract<KVPairs, KVPair<K, any>>["V"]> /*[
        MakeKVObjectsFromUnion<K, Extract<KVPairs, KVPair<K, any>>["V"]>,
        UnionKVPairsToObject<Exclude<KVPairs, KVPair<K, any>>>
      ];*/;
    }>;

type IsUnion<T> = [T] extends TuplifyUnion<T> ? false : true;

type DistributeDeepHelper<T> = T extends [infer First]
  ? Distribute<First>
  : T extends [infer First, ...infer Rest]
  ? Distribute<First> | DistributeDeepHelper<Rest>
  : never;

export type DistributeDeep<T> = DistributeDeepHelper<TuplifyUnion<T>>;
// type isUnion = IsUnion<"a" | "b">

type DistributeDeepHelperV2<T> = T extends [infer First]
  ? [/*Distribute<First>*/ First]
  : T extends [infer First, ...infer Rest]
  ? [First, Rest] //Distribute<First> & DistributeDeepV2<Rest>
  : never;

export type DistributeDeepV2<T> = DistributeDeepHelperV2<TuplifyUnion<T>>;

type TestObj = { obj: { x: true | false }; y: 3 | 4 };

type DistributedTest = DistributeDeepV2<TestObj>;
type ExtractedTest = Extract<DistributedTest, { obj: { x: true }; y: 3 }>; //["y"]
