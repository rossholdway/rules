import { isValidResult } from "./helpers";

/**
 * Public
 * *****************************************************************
 */
 export type Valid<Output> = {
  success: true;
  value: Output;
}

export type Invalid = {
  success: false;
  errors: Err[]
}

export type InvalidRefined = {
  success: false;
  errors: Omit<Err, "value" | "name" | "path">[];
}

export type Err = {
  value: unknown;
  name: string;
  path: string[];
  code: string;
  message: string;
}

export type ctx = {}

export type Rule<Output> = (path: string[], value: unknown, ctx: ctx) => Valid<Output> | Invalid;

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
export { union } from "./utils/union";



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
  const result = schema([], value, ctx);

  if (isValidResult(result)) {
    return [undefined, result.value];
  } else {
    return [result.errors, undefined];
  }
}


