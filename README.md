![Test](https://github.com/rossholdway/validate/actions/workflows/ci.yml/badge.svg)

# Validate

A simple TypeScript runtime validator with good performance, zero dependencies
and developer friendly UX.

Build a schema using predefined rules, or create your own. Valid data will be
returned typed.

## Demo

TODO: Add demo

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
const email = refine("email", str(), (value, ctx) => {
  if (/\S+@\S+\.\S+/.test(value)) {
    return { success: true, value };
  } else {
    return {
      success: false,
      errors: [{
        code: "invalid_email",
        message: "Must be a valid email",
      }],
    };
  }
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

TODO: Document API

## Contributing

### Adding and updating dependencies

When adding, updating or removing dependencies you should make sure to update
the `.deno` cache:
