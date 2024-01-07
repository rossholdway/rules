![Test](https://github.com/rossholdway/rules/actions/workflows/ci.yml/badge.svg)

# Rules

A simple Deno 🦕 TypeScript runtime validator with good performance, zero dependencies
and developer friendly UX.

Build a schema using predefined rules, or create your own. Valid data will be
returned typed.

## Getting started

Using the rule `str()` we can validate that any given data is of type string.
The `parse` method will always return an array containing any errors (or
undefined if there are none) followed by the validated data itself (or undefined
if invalid).

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

### Validation

#### parse

Provide a schema and value to `parse(schema, value)` to validate your data. A tuple of [errors, validated_data] will be returned. If errors are present, validated_data will be undefined. If your data is valid, errors will be undefined.

```typescript
const schema = obj({name: str()});
const [errors, user] = parse(schema, { name: "Homer" });

// errors
undefined

// user
{
  name: "Homer"
}
```

```typescript
const schema = obj({name: str()});
const [errors, user] = parse(schema, {});

// errors
Map {
  "name" => [
    {
      name: "str",
      value: undefined,
      path: ["name"],
      code: "required",
      message: "is required"
    }
  ]
}

// user
undefined
```

### Context

Context is available within all rules and utils. It contains some useful information and helper methods.

#### ctx.value
`ctx.value` contains the value.

#### ctx.path
`ctx.path` contains the path taken. This will be an array of the object properties or position within the array of the rule.

#### ctx.error
`ctx.error(code, message, meta)` takes a code (an error code string), an error message and a meta object to hold additional details.

#### ctx.success
`ctx.success` returns a success object.

### Rules

#### any
Allow any value as valid.
```typescript
any()
```

#### array
Allow an array of values. A min and / or max array length can also be specified.
```typescript
array(str(), { min: 1, max: 3 })
```

#### bigInt
Must be a bigint value e.g. `100n`.
```typescript
bigInt()
```

#### boolean
Value must be either `true` or `false`.
```typescript
bool()
```

#### enum
Value must be one of the given literal values.
```typescript
enums(["Homer", "Max Power", "Mr. Plow"] as const
```

#### literal
Value must be an exact match (using `===`).
```typescript
literal(742)
```

#### never
Validation will always fail.
```typescript
never()
```

#### num
Value must be a number. A min and / or max value can also be specified. If the number must be an integer, set `integer` to `true`.
```typescript
num({min: 5, max: 10, integer: true})
```

#### obj
Validate that the provided value is an object, and that each property is also valid. Can be nested. Any unknown or undefined properties will be excluded from the returned object.
```typescript
obj({
  name: str(),
  knownAs: array(str()),
  age: num(),
});
```

#### regex
Value must be a string that passes the provided regular expression.
```typescript
regex(/Bart/i)
```

#### str
Value must be a string. A min and / or max length can also be specified. The string can also be trimmed of whitespace via `trim: true` .
```typescript
str({min: 5, max: 10, trim: true})
```

#### tuple
Validates that a value is an array of the same length, with each value being the given type at that position.
```typescript
tuple([str(), num()])
```

### Utils

#### coerce
Coerce a value into another allowing you to transform input data (before validation).

The example below attempts to coerce the input to number, before passing the value on to be validated. If the value cannot be coerced, it is returned as is.
```typescript
coerce(num(), (value) => {
  if (typeof value === "string") {
    return parseInt(value, 10);
  } else {
    return value;
  }
})
```
The coercion function can also be provided separately.
```typescript
const coerceFn: coerceFn<number> = (value) => {
  if (typeof value === "string") {
    return parseInt(value, 10);
  } else {
    return value;
  }
};

coerce(str(), coerceFn);
```

#### defaulted
Provide a default if it's undefined (before validation).
```typescript
defaulted(str(), (ctx) => "30")
```
The defaulted function can also be provided separately.
```typescript
const defaultedFn: defaultedFn<string> = (ctx) => "30";

defaulted(str(), defaultedFn);
```

#### dynamic
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

#### intersection
Used to validate that a group of rules pass.
```typescript
intersection([
  str({ min: 4 }),
  regex(/Bart/i)
])
```

#### nullable
Allow a value to be null.
```typescript
nullable(str())
```

#### optional
Allow a value to be undefined.
```typescript
optional(str())
```

#### refine
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

#### union
Validate that a value matches at least one rule.
```typescript
union([
  literal("Homer"),
  literal("Marge")
])
```

### Helpers

#### format
`format` can be used to generate a nice `Map` of error messages. Path name will be appended to the start of the error message, sentance cased and any `.` or `_` replaced with a whitespace. It will also combine `union` error messages into a single message if the union is invalid.

```typescript
const schema = obj({
  account: obj({
    first_name: str()
  })
});
const [errors, user] = parse(schema, { account: {} });

format(errors);

// Output
Map { "account.first_name" => [ "Account first name is required" ] }

```

#### isValid
`isValid` can be used as a helpful type guard for narrowing the result.

```typescript
const result = parse(schema, { name: "Homer" })

if(isValid(result)) {
  const name = result[1].name
}
```
#### Infer
`Infer` can be used as a TypeScript util to infer the return type of a Rule.
```typescript
const homer = obj({
  name: literal("Homer"),
  catchphrase: literal("D'oh")
});

type Homer = Infer<typeof homer>;

// Type is now:
{
  name: "Homer";
  catchphrase: "D'oh";
}
```

#### Codes
A list of predefined error codes.

## Contributing

### Tests

Run tests manually with `deno task test`
