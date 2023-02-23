import { ArrayVals } from "../types/helpers/ArrayVals";
import { KVObject } from "../types/helpers/KVObject";
import { MergeObjects } from "../types/helpers/MergeObjects";
import { Shift } from "../types/helpers/shift";

type Split<T, Seperator extends string> = T extends `${infer First}${Seperator}${infer Rest}`
  ? [First, ...Split<Rest, Seperator>]
  : [T];

type SplitTrim<T, Seperator extends string> = T extends `${infer First}${Seperator}${infer Rest}`
  ? [Trim<First>, ...SplitTrim<Rest, Seperator>]
  : [Trim<T>];

type Test = Split<"Hello There", " ">;

type Trim<T> = T extends `${infer First} `
  ? Trim<First>
  : T extends `${infer First}\n`
  ? Trim<First>
  : T extends ` ${infer First}`
  ? Trim<First>
  : T;

type TrimTest = Trim<"abc    ">;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface StringTypeMap {
  string: string;
  number: number;
}

type StringType = keyof StringTypeMap;

type StringToType<T extends StringType> = StringTypeMap[T];

type MapStringsToTypes<T> = T extends [infer First extends StringType, ...infer Rest]
  ? [StringToType<First>, ...MapStringsToTypes<Rest>]
  : [];

type ParseConstructor<T> = SplitTrim<Trim<T>, " "> extends [infer ConstructorName, ...infer ArgTypes]
  ? [ConstructorName, ...MapStringsToTypes<ArgTypes>]
  : [];

type MappableTypes<T> = {
  Trim: Trim<T>;
  ParseConstructor: ParseConstructor<T>;
  StringToType: T extends StringType ? StringToType<T> : never;
};

type URIs = keyof MappableTypes<unknown>;

type MapType<T, URI extends URIs> = T extends [infer First, ...infer Rest]
  ? [MappableTypes<First>[URI], ...MapType<Rest, URI>]
  : [];
// type MapTrim<T> = T extends [infer First] ? [Trim<First>] : T extends [infer First, infer Rest] ? [Trim<First>, ...MapTrim<Rest>] : []

type Test2 = MappableTypes<"Left string">["ParseConstructor"];

type Example = `| Left string string
                | Right string number`;

type Generic<T extends string> = `Generic_${T}`;

type Constructors<T> = SplitTrim<T, "|">;
type ParseDataClass<T> = MapType<Shift<Constructors<T>>, "ParseConstructor">;
type ExampleConstructors = Shift<Constructors<Example>>;
type Constructor = ParseConstructor<ExampleConstructors[0]>;

type ConstructorsToObject<T extends [string, ...unknown[]][]> = {
  [Key in ArrayVals<T>[0]]: ConstructorToFunc<Extract<ArrayVals<ParsedClass>, [Key, ...unknown[]]>>;
};

type ParsedClass = ParseDataClass<Example>;

type ConstructorObj = ConstructorsToObject<ParsedClass>;
// type Extracted = Extract<ArrayVals<ParsedClass>, ["Left", ...unknown[]]>

type ConstructorToFunc<T> = T extends [string, ...infer Types]
  ? <TInstance extends Types>(...args: TInstance) => TInstance
  : never;

type ConstructorToFunc2<T> = T extends [string, ...infer Types]
  ? <TInstance extends Types>(...args: TInstance) => TInstance
  : never;

const GenericMismatchSymbol = Symbol("GenericMismatch");
type GenericMismatch = { [GenericMismatchSymbol]: true };

const UnboundGenericSymbol = Symbol("UnboundGenericSymbol");
type UnboundGeneric = { [UnboundGenericSymbol]: true };

type BaseGenericBinds<GenericLabels extends string> = {
  [GenericLabel in GenericLabels]: UnboundGeneric;
};

type Assign<GenericBinds extends Record<string, unknown>, GenericLabel extends keyof GenericBinds, Bind> = MergeObjects<
  Omit<GenericBinds, GenericLabel>,
  KVObject<GenericLabel, Bind>
>;

type VerifyGenericTypes<
  Template,
  GenericLabels extends string,
  Instance,
  GenericBinds extends Record<string, unknown> = BaseGenericBinds<GenericLabels>
> = Template extends [infer TemplateFirst, ...infer TemplateRest]
  ? Instance extends [infer InstanceFirst, ...infer InstanceRest]
    ? TemplateFirst extends GenericLabels
      ? GenericBinds[TemplateFirst] extends UnboundGeneric
        ? [
            InstanceFirst,
            ...VerifyGenericTypes<TemplateRest, GenericLabels, InstanceRest, Assign<GenericBinds, TemplateFirst, InstanceFirst>>
          ]
        : InstanceFirst extends GenericBinds[TemplateFirst]
        ? [InstanceFirst, ...VerifyGenericTypes<TemplateRest, GenericLabels, InstanceRest, GenericBinds>]
        : [GenericMismatch]
      : [InstanceFirst, ...VerifyGenericTypes<TemplateRest, GenericLabels, InstanceRest, GenericBinds>]
    : []
  : [];

// type TestMismatch = VerifyGenericTypes<[string, "A", "A"], "A", [string, number, number]>
// type TestMismatchFail = VerifyGenericTypes<[string, "A", "A"], "A", [string, number, string]>

// const constructType = <T>() => {
//   type Types = T extends [string, ...infer Types] ? Types : never
//   return void 0 as unknown as Types
// }

// const constructType1 = <T>() => {
//   type Types = T extends [string, ...infer Types] ? Types : never
//   return void 0 as unknown as Types
// }

// type ConstructorFunc = ConstructorToFunc<ParsedClass[0]>

interface GenericDataClasses2<A, B> {
  Test: never
}

type ExampleGeneric<A extends StringType = Generic<>, 
                    B extends StringType> = `<${A}, ${B}> | Left ${A}
                                                                  | Right ${B}`;

type Instance<URI extends keyof GenericDataClasses2<unknown, unknown>> = <T>() => GenericDataClasses2[URI]

// type Tree = `Tree<T> =  | Leaf
//                         | Node Tree<T>  Tree<T>`

type List = `List<T> =  | []
                        | _:_`