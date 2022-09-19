import { Codes, Rule, Context } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

/**
 * Array validation
 * Value is an array or given rules
 * *****************************************************************
 */
export type array = typeof array;

export function array<T>(
  ruleFn: Rule<T>,
  { max, min }: { max?: number; min?: number } = {},
): Rule<T[]> {
  return function array(ctx) {
    const data: T[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (!Array.isArray(ctx.value)) {
      return ctx.error(Codes.invalid_type, "Must be an array")
    }

    if (min && ctx.value.length < min) {
      return ctx.error(
        Codes.invalid_min_length,
        `Must not be less than ${min} entries`,
        { min }
      )
    }

    if (max && ctx.value.length > max) {
      return ctx.error(
        Codes.invalid_max_length,
        `Must not be greater than ${max} entries`,
        { max }
      )
    }

    // if (unique && value.length !== new Set(value).size) {
    //   errors.push({code: "invalid_max_length", message: "Duplicate values are not permitted"});
    // }

    for (const [i, v] of ctx.value.entries()) {
      const result = ruleFn(
        new Context(ruleFn.name, v, [...ctx.path, i.toString()], ctx.errors)
      );
      if (isValidRule(result)) {
        data.push(result.value);
      }
    }

    return (ctx.errors.length === 0)
      ? { success: true, value: data }
      : { success: false };
  };
}
