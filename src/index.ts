import { isValidResult } from "./helpers";

/**
 * Private
 * *****************************************************************
 */
function addError<Input = unknown>(errors: Err<Input>[]) {
  return function add(error: Err<Input>) {
    errors.push(error);
  };
}

// function valid(errors: Map<string, Err[]>) {
//   return function has(path: string) {
//     return !errors.has(path);
//   };
// }

/**
 * Public
 * *****************************************************************
 */
 export type Valid<Output> = {
  success: true;
  value: Output;
}

export type Invalid<Input> = {
  success: false;
  errors: Err<Input>[]
}

export type InvalidRefined = {
  success: false;
  errors: Omit<Err, "value" | "name" | "path">[];
}

// export type Response<Input, Output> = {
//   input: Input;
//   output: Output;
//   name: string;
//   path: string[];
// }

export type Err<Input = unknown> = {
  value: Input;
  name: string;
  path: string[];
  code: string;
  message: string;
}

export type ctx = {
  // error: {
  //   add<Input>(error: Err<Input>): ({value: Input; name: string; path: string[];});
  // }
}

export type Rule<Output, Input = unknown> = (path: string[], value: Input, ctx: ctx) => Valid<Output> | Invalid<Input>;

// Rules
export { str } from "./rules/string";
export { obj } from "./rules/object";
export { literal } from "./rules/literal";
export { enums } from "./rules/enum";
export { array } from "./rules/array";

// Utils
export { coerce } from "./utils/coerce";
export { defaulted } from "./utils/defaulted";
export { dynamic } from "./utils/dynamic";
export { intersection } from "./utils/intersection";
export { optional } from "./utils/optional";
export { refine } from "./utils/refine";
// export { union } from "./utils/union";



// function next(errors: Err[]) {
//   return function next(rule: string, path: string[], value: unknown, ruleErrors: Err[] = [], valid?: boolean) {
//     valid = valid ?? ruleErrors.length === 0;
//     if (!valid) { errors.push(...ruleErrors); }
//     return {valid, rule, path, value};
//   };
// }

export function isValid<Output>(result: [Err[], undefined] | [undefined, Valid<Output>["value"]]): result is [undefined, Valid<Output>["value"]] {
  return typeof result[0] === "undefined";
}

export function parse<S>(schema: Rule<S>, value: unknown): [undefined, Valid<S>["value"]] | [Err[], undefined] {
  const ctx = {};
  const result = schema(["initial"], value, ctx);

  if (isValidResult(result)) {
    return [undefined, result.value];
  } else {
    return [result.errors, undefined];
  }
}


