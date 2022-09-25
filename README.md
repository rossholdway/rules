![Test](https://github.com/rossholdway/validate/actions/workflows/ci.yml/badge.svg)

# Validate

A simple TypeScript runtime validator with good performance, zero dependencies
and developer friendly UX.

Build a schema using predefined rules, or create your own. Valid data will be
returned typed.

## Getting started

Using the rule `str()` we can validate that any given data is of type string.
The `parse` method will always return an array containing any errors (or
undefined if there are none) followed by the validated data itself (or undefined
if it was invalid).

```Typescript
parse(str(), "Homer");
```

We can also validate more complex structures such as objects and arrays.

```Typescript
const User = obj({
  name: str(),
  knownAs: array(str()),
  age: num(),
});

const data = {
  name: "Homer",
  knownAs: ["Max Power", "Pie Man", "Mr. Plow"],
  age: 39,
};

parse(User, data);
```

At some point you'll likely want your own custom validation logic. Using
`refine` will allow you to do just that, by building on top of existing rules.

```Typescript
// A custom, reusable validation rule
const email = refine("email", str(), (ctx) => {
  if (!/\S+@\S+\.\S+/.test(ctx.value)) {
    return ctx.error(
      "invalid_email",
      "Must be a valid email"
    )
  }
  return ctx.success();
});

const User = obj({
  name: str(),
  email: email,
});

const data = {
  name: "Homer",
  email: "chunkylover53@aol.com",
};

parse(User, data);
```

## Documentation

### Context

Context is available within all rules and utils. It contains some useful information and helper methods.

#### Value
`ctx.value` contains the initial value.

#### Path
`ctx.path` contains the path taken. This will be an array of the object properties or position within the array of the rule.

#### Errors
`ctx.errors` is an array of errors.

```typescript
{
  name: string;
  path: string[];
  value: unknown;
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}
```

#### Error
`ctx.error(code, message, meta)` takes a code (an error code string), an error message and a meta object to hold additional details.

#### Success
`ctx.success` returns a success object.

### Rules

#### Any
Allow any value as valid.
```typescript
any()
```

#### Array
Allow an array of values. A min and / or max array length can also be specified.
```typescript
array(str(), { min: 1, max: 3 })
```

#### BigInt
Must be a bigint value e.g. `100n`.
```typescript
bigInt()
```

#### Boolean
Value must be either `true` or `false`.
```typescript
bigInt()
```

#### Enum
Value must be one of the given literal values.
```typescript
enums(["Homer", "Max Power", "Mr. Plow"] as const
```

#### Literal
Value must be an exact match (using `===`).
```typescript
literal(742)
```

#### Never
Validation will always fail.
```typescript
never()
```

#### Number
Value must be a number. A min and / or max value can also be specified. If the number must be an integer, set `integer` to `true`.
```typescript
num({min: 5, max: 10, integer: true})
```

#### Object
Validate that the provided value is an object, and that each property is also valid. Can be nested. Any unknown or undefined properties will be excluded from the returned object.
```typescript
obj({
  name: str(),
  knownAs: array(str()),
  age: num(),
});
```

#### Regex
Value must be a string that passes the provided regular expression.
```typescript
regex(/Bart/i)
```

#### String
Value must be a string. A min and / or max length can also be specified. The string can also be trimmed of whitespace via `trim: true` .
```typescript
str({min: 5, max: 10, trim: true})
```

#### Tuple
Validates that a value is an array of the same length, with each value being the given type at that position.
```typescript
tuple([str(), num()])
```

### Utils

#### Coerce
Coerce a value into another allowing you to transform input data (before validation).

The example below coerces a number to string, before passing the value on to be validated. If the value cannot be coerced, it is returned as is.
```typescript
coerce(str(), (value) => {
  if (typeof value === "number") {
    return value.toString();
  } else {
    return value;
  }
})
```
The coercion function can also be provided separately.
```typescript
const coerceFn: coerceFn<string> = (value) => {
  if (typeof value === "number") {
    return value.toString();
  } else {
    return value;
  }
};

coerce(str(), coerceFn);
```

#### Defaulted
Provide a default if it's undefined (before validation).
```typescript
defaulted(str(), (ctx) => "30")
```
The defaulted function can also be provided separately.
```typescript
const defaultedFn: defaultedFn<string> = (ctx) => "30";

defaulted(str(), defaultedFn);
```

#### Dynamic
Decide what validation to run at runtime.
```typescript
const Homer = obj({
  name: literal("Homer"),
  catchphrase: literal("D'oh")
});

const Character = obj({
  name: str(),
  catchphrase: str()
});

dynamic((ctx) => {
  if (ctx.value?.name === "Homer") {
    return Homer;
  } else {
    return Character;
  }
})
```
The dynamic function can also be provided separately.
```typescript
const dynamicCb: dynamicFn<typeof Homer | typeof Character> = (ctx) => {
  if (ctx.value?.name === "Homer") {
    return Homer;
  } else {
    return Character;
  }
};
```

#### Intersection
Used to validate that a group of rules pass.
```typescript
intersection([
  str({ min: 4 }),
  regex(/Bart/i)
])
```

#### Nullable
Allow a value to be null.
```typescript
nullable(str())
```

#### Optional
Allow a value to be undefined.
```typescript
optional(str())
```

#### Refine
Allow an existing rule to be refined. Useful for defining your own rules.
```typescript
refine("email", str(), (ctx) => {
  if (!/\S+@\S+\.\S+/.test(ctx.value)) {
    return ctx.error(
      "invalid_email",
      "Must be a valid email"
    )
  }
  return ctx.success();
});
```
Your refinement can also be provided separately.

```typescript
const refineCb: refineCb<string> = (ctx) => {
  // Is it a valid email?
  if (!/\S+@\S+\.\S+/.test(ctx.value)) {
    return ctx.error(
      "invalid_email",
      "Must be a valid email"
    )
  }
  return ctx.success();
};

refine("email", str(), refineCb);
```

#### Union
Validate that a value matches at least one rule.
```typescript
union([
  literal("Homer"),
  literal("Marge")
])
```

### Helpers

#### isValid
`isValid` can be used as a helpful type guard for narrowing the result.

```typescript
const result = parse(schema, { name: "Homer" })

if(isValid(result)) {
  const name = result[1].name
}
```
#### Infer
`Infer` can be used as a TypeScript util to infer the return type of a r
Rule.
```typescript
const homer = obj({
  name: literal("Homer"),
  catchphrase: literal("D'oh")
});

type Homer = Infer<typeof homer>;

// Type is now:
// {
//   name: "Homer";
//   catchphrase: "D'oh";
// }
```

#### Codes
A list of predefined error codes.

## Contributing

### Adding and updating dependencies

When adding, updating or removing dependencies you should make sure to update
the `.deno` cache with `deno cache --reload --lock=lock.json --lock-write ./**/*.ts`

Run tests manually with `deno test test/**/*.test.ts --lock=lock.json --cached-only`
