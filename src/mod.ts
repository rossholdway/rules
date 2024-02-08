// Helpers
import { isValidRule } from "./helpers.ts";

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
import { regex } from "./rules/regex.ts";
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
 * Private
 * *****************************************************************
 */

const groupErrors = <T extends Err>(arr: T[]): Map<string, T[]> => {
  return arr.reduce((storage, item) => {
    const objKey = (item.path.length > 0) ? item.path.join('.') : 'value';
    if (!storage.has(objKey)) {
      storage.set(objKey, []);
    }
    storage.get(objKey)!.push(item);
    return storage;
  }, new Map() as Map<string, T[]>);
}

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
};

export type Err = {
  name: string;
  path: string[];
  value: unknown;
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
  regex_no_match = "regex_no_match"
}

export class Context<T = unknown> {
  #name: string;
  value: T;
  path: string[];
  errors: Err[];

  constructor(name: string, value: T, path: string[], errors: Err[]) {
    this.#name = name;
    this.value = value;
    this.path = path;
    this.errors = errors;
  }

  success() {
    return { success: true, value: this.value }
  }

  error(code: string, message: string, meta?: Record<string, unknown>): Invalid {
    this.errors.push({
      name: this.#name,
      value: this.value,
      path: this.path,
      code,
      message,
      meta
    })
    return {success: false};
  }
}

export type Rule<Output> = (ctx: Context) => Valid<Output> | Invalid;

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
  regex,
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
  regex,
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

export function isValid<Output>(
  result: [Map<string, Err[]>, undefined] | [undefined, Valid<Output>["value"]],
): result is [undefined, Valid<Output>["value"]] {
  return typeof result[0] === "undefined";
}

export function format(errors: Map<string, Err[]>, options: {
  humanise?: boolean
} = {}): Map<string, {code: string, message: string}[]> {
  const { humanise = true } = options;
  const messages = new Map();

  for (const [key, value] of errors) {
    const name = humanise ? (key[0].toUpperCase() + key.slice(1)).replace(/(\.|_)/g, " ") : key;
    const output: {code: string, message: string}[] = [];

    for (const e of value) {
      if (e.meta?.union) { break; } // Filter out union child errors
      output.push({code: e.code, message: `${name} ${e.message}`});
      if (e.name === "union") { break; }
    }
    if(output.length > 0) {
      messages.set(key, output);
    }
  }
  return messages;
}

export function parse<S>(
  schema: Rule<S>,
  value: unknown,
): [Map<string, Err[]>, undefined] | [undefined, Valid<S>["value"]] {
  const errors: Err[] = [];
  const ctx = new Context(schema.name, value, [], errors);
  const result = schema(ctx);
  
  if (isValidRule(result)) {
    return [undefined, result.value];
  } else {
    return [groupErrors(errors), undefined];
  }
}
