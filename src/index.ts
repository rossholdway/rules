// Helpers
import { isValidResult } from "./helpers";

// Rules
import { str } from "./rules/string";
import { num } from "./rules/number";
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
  meta?: Record<string, unknown>;
}

export enum Codes {
  required = "required",
  invalid_type = "invalid_type",
  invalid_min_length = "invalid_min_length",
  invalid_max_length = "invalid_max_length",
  invalid_enum = "invalid_enum",
  invalid_union = "invalid_union",
  invalid_integer = "invalid_integer"
}

export type ctx = Record<string, never>;

export type Rule<Output> = (path: string[], value: unknown, ctx: ctx) => Valid<Output> | Invalid;

export type Infer<R extends Rule<unknown>> = R extends Rule<infer T> ? T : unknown;

const all = {
  // Rules
  str,
  num,
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
  num,
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
