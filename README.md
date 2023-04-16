# TS-Pattern

Full storngly typed pattern matching in TS

## Examples

### Basic Example:
```typescript
const msg = match(userName)
              .against("Morpheus", () => "Welcome!")
              .against("Dave", () => "I'm sorry I can't let you do that")
              .against(_(), () => "Unknown user")
              .exhaustive()

console.log(msg)
```

### Destructuring:
```typescript
type User = { name: string, age: number }

const greet = (user: User) => {
  return match(user)
          .against({name:_("name"), age: _("age")}, ({name, age}) => `Hello ${name}, you are ${age} year old! ...but you probably knew that already`)
          .exhaustive()
}
```

### Arrays:
```typescript
type Point = [x: number, y: number]

const move = (initialLocation: Point, deltaX: number, deltaY: number) => {
  return match(initialLocation)
          .against([_("x"), _("y")], ({x, y}) => [x + deltaX, y + deltaY])
          .exhaustive()
}
```

#### Array Rest Patterns:
```typescript
const sum = (nums: number[]) => {
  return match(nums)
          .against([_("first"), _("rest").rest], ({first, rest}) => first + sum(rest))
          .against([], () => [])
          .exhaustive()
}
```

### Discriminated Unions:
```typescript
type User = { admin: false, name: string, age: number } | { admin: true, name: string, accessLevel: number }

const greet = (user: User) => {
  return match(user)
          .against({ admin: false, name:_("name"), age: _("age") }, ({name, age}) => `Hello ${name}, you are ${age} year old! ...but you probably knew that already`)
          .against({ admin: true, name:_("name"), accessLevel: _("accessLevel") }, ({name, accessLevel}) => `Hello ${name}, you have Level ${accessLevel} access.`)
          .exhaustive()
}
```

### ADTs/Tagged Unions:
```typescript
  type Tree<T> =  | Tagged<"Leaf"> 
                  | Tagged<"Node", { left: Tree<T>; right: Tree<T>; value: T }>;

  const { Leaf, Node } = Tags<Tree<InferGenericType>>()("Leaf", "Node");

  const inOrderTraversal = (tree: Tree<string | number>): string =>
    match(tree)
      .against(Leaf(), () => " ")
      .against(Node({ left: _("left"), right: _("right"), value: _("value") }), ({ left, right, value }) => {
        return `${inOrderTraversal(left)}${value}${inOrderTraversal(right)}`;
      })
      .exhaustive();
```

### Exhaustiveness Checking

```typescript
type ResponseCode = 200 | 404 | 418

//Incorrect
const handleResponse = (response: Response) => {
  return match(response)
          .against(200, () => "Nice!")
          .against(404, () => "Oops")
        .exhaustive()
        //^Gives a TypeError, exhaustive is not callable
}

//Correct
const handleResponse = () => {
  return match(response)
          .against(200, () => "Nice!")
          .against(404, () => "Oops")
          .against(418, () => "...wut?")
        .exhaustive()
        //Works just fine
}

//(Also) Correct
const handleResponse = () => {
  return match(response)
          .against(200, () => "Nice!")
          .against(404, () => "Oops")
          .against(_, () => "Anything else could be happening")
        .exhaustive()
        //Works just fine
}

```

### Type Inference
```typescript

  type DogOrTree =  | Tagged<"Dog", { age: number; bark: () => string }> 
                    | Tagged<"Tree", { age: number; bark: boolean }>;

  const { Dog, Tree } = Tags<DogOrTree>()("Dog", "Tree");

  //Incorrect
  const meet = (item: DogOrTree) => {
    return match(item)
              .against(Dog({age: _, bark: _("bark")}), ({bark}) => {
                bark()
                //^Works fine, typeof bark is () => void
              })
              .against(Tree({age: _, bark: _("bark")}), ({bark}) => {
                bark()
                //^TypeError, typeof bark is boolean
              })
              .exhaustive()
  }

  //Correct
  const meet = (item: DogOrTree) => {
    return match(item)
              .against(Dog({age: _, bark: _("bark")}), ({bark}) => {
                bark()
                return "Dog!"
              })
              .against(Tree({age: _, bark: _("bark")}), ({bark}) => {
                return `Tree ${bark ? "with" : "without"} bark`
              })
              .exhaustive()
  }

  //(Also) Correct, actually doesn't work rn
  const meet = (item: DogOrTree) => {
    return match(item)
              .against(Tree({age: _, bark: _("bark")}), ({bark}) => {
                return `Tree ${bark ? "with" : "without"} bark`
              })
              .against(_("dog")), ({dog}) => {
                dog.bark()
                return "Dog!"
              })
              .exhaustive()
  }
```