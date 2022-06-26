// Helpers
import { isValidResult } from "./helpers.ts";

// Rules
import { any } from "./rules/any.ts";
import { array } from "./rules/array.ts";
import { bigInt } from "./rules/bigint.ts";
import { bool } from "./rules/boolean.ts";
import { enums } from "./rules/enum.ts";
import { literal } from "./rules/literal.ts";
import { never } from "./rules/never.ts";
import { num } from "./rules/number.ts";
import { obj } from "./rules/object.ts";
import { str } from "./rules/string.ts";
import { tuple } from "./rules/tuple.ts";

// Utils
import { coerce } from "./utils/coerce.ts";
import { defaulted } from "./utils/defaulted.ts";
import { dynamic } from "./utils/dynamic.ts";
import { intersection } from "./utils/intersection.ts";
import { nullable } from "./utils/nullable.ts";
import { optional } from "./utils/optional.ts";
import { refine } from "./utils/refine.ts";
import { union } from "./utils/union.ts";

/**
 * Public
 * *****************************************************************
 */
export type Valid<Output> = {
  success: true;
  value: Output;
};

export type Invalid = {
  success: false;
  errors: Err[];
};

export type InvalidRefined = {
  success: false;
  errors: Omit<Err, "value" | "name" | "path">[];
};

export type Err = {
  value: unknown;
  name: string;
  path: string[];
  code: string;
  message: string;
  meta?: Record<string, unknown>;
};

export enum Codes {
  required = "required",
  invalid = "invalid",
  invalid_type = "invalid_type",
  invalid_min_length = "invalid_min_length",
  invalid_max_length = "invalid_max_length",
  invalid_enum = "invalid_enum",
  invalid_union = "invalid_union",
  invalid_integer = "invalid_integer",
  invalid_literal = "invalid_literal",
  invalid_length = "invalid_length",
}

export type ctx = Record<string, never>;

export type Rule<Output> = (
  path: string[],
  value: unknown,
  ctx: ctx,
) => Valid<Output> | Invalid;

export type Infer<R extends Rule<unknown>> = R extends Rule<infer T> ? T
  : unknown;

export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => unknown : never
) extends (arg: infer I) => void ? I
  : never;

// Recursive conditional Tuple type
// https://github.com/ianstormtaylor/superstruct
export type InferTuple<
  Tuple extends Rule<unknown>[],
  Length extends number = Tuple["length"],
> = Length extends Length ? number extends Length ? Tuple
  : _InferTuple<Tuple, Length, []>
  : never;
type _InferTuple<
  Tuple extends Rule<unknown>[],
  Length extends number,
  Accumulated extends unknown[],
  Index extends number = Accumulated["length"],
> = Index extends Length ? Accumulated
  : _InferTuple<Tuple, Length, [...Accumulated, Infer<Tuple[Index]>]>;

const all = {
  // Rules
  any,
  array,
  bigInt,
  bool,
  enums,
  literal,
  never,
  num,
  obj,
  str,
  tuple,
  // Utils
  coerce,
  defaulted,
  dynamic,
  intersection,
  nullable,
  optional,
  refine,
  union,
};

export {
  all as default,
  any,
  array,
  bigInt,
  bool,
  coerce,
  defaulted,
  dynamic,
  enums,
  intersection,
  literal,
  never,
  nullable,
  num,
  obj,
  optional,
  refine,
  str,
  tuple,
  union,
};

export function isValid<Output>(
  result: [Err[], undefined] | [undefined, Valid<Output>["value"]],
): result is [undefined, Valid<Output>["value"]] {
  return typeof result[0] === "undefined";
}

export function parse<S>(
  schema: Rule<S>,
  value: unknown,
): [undefined, Valid<S>["value"]] | [Err[], undefined] {
  const ctx = {};
  const result = schema([], value, ctx);

  if (isValidResult(result)) {
    return [undefined, result.value];
  } else {
    return [result.errors, undefined];
  }
}
