// Helpers
import { isValidResult } from "./helpers";

// Rules
import { str } from "./rules/string";
import { obj } from "./rules/object";
import { literal } from "./rules/literal";
import { enums } from "./rules/enum";
import { array } from "./rules/array";

// Utils
import { coerce } from "./utils/coerce";
import { defaulted } from "./utils/defaulted";
import { dynamic } from "./utils/dynamic";
import { intersection } from "./utils/intersection";
import { optional } from "./utils/optional";
import { refine } from "./utils/refine";
import { union } from "./utils/union";

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

export type ctx = Record<string, never>;

export type Rule<Output> = (path: string[], value: unknown, ctx: ctx) => Valid<Output> | Invalid;

const all = {
  // Rules
  str,
  obj,
  literal,
  enums,
  array,
  // Utils
  coerce,
  defaulted,
  dynamic,
  intersection,
  optional,
  refine,
  union
};

export {
  all as default,
  str,
  obj,
  literal,
  enums,
  array,
  coerce,
  defaulted,
  dynamic,
  intersection,
  optional,
  refine,
  union
};

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
