// Helpers
import { isValidResult } from "./helpers";

// Rules
import { any } from "./rules/any";
import { array } from "./rules/array";
import { bigInt } from "./rules/bigint";
import { bool } from "./rules/boolean";
import { enums } from "./rules/enum";
import { literal } from "./rules/literal";
import { never } from "./rules/never";
import { num } from "./rules/number";
import { obj } from "./rules/object";
import { str } from "./rules/string";
import { tuple } from "./rules/tuple";

// Utils
import { coerce } from "./utils/coerce";
import { defaulted } from "./utils/defaulted";
import { dynamic } from "./utils/dynamic";
import { intersection } from "./utils/intersection";
import { nullable } from "./utils/nullable";
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
  invalid = "invalid",
  invalid_type = "invalid_type",
  invalid_min_length = "invalid_min_length",
  invalid_max_length = "invalid_max_length",
  invalid_enum = "invalid_enum",
  invalid_union = "invalid_union",
  invalid_integer = "invalid_integer",
  invalid_literal = "invalid_literal",
  invalid_length = "invalid_length"
}

export type ctx = Record<string, never>;

export type Rule<Output> = (path: string[], value: unknown, ctx: ctx) => Valid<Output> | Invalid;

export type Infer<R extends Rule<unknown>> = R extends Rule<infer T> ? T : unknown;

export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => unknown : never
) extends (arg: infer I) => void
  ? I
  : never

// Recursive conditional Tuple type
// https://github.com/ianstormtaylor/superstruct
export type InferTuple<
  Tuple extends Rule<unknown>[],
  Length extends number = Tuple["length"]
> = Length extends Length
  ? number extends Length
    ? Tuple
    : _InferTuple<Tuple, Length, []>
  : never
type _InferTuple<
  Tuple extends Rule<unknown>[],
  Length extends number,
  Accumulated extends unknown[],
  Index extends number = Accumulated["length"]
> = Index extends Length
  ? Accumulated
  : _InferTuple<Tuple, Length, [...Accumulated, Infer<Tuple[Index]>]>

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
  union
};

export {
  all as default,
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
  coerce,
  defaulted,
  dynamic,
  intersection,
  nullable,
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
