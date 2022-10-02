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
  { 
    max, min,
    required_error = "is required",
    invalid_type_error = "must be an array",
    invalid_min_length_error = `must not have less than ${min} entries`,
    invalid_max_length_error = `must not have more than ${max} entries`
  }: {
    max?: number; min?: number;
    required_error?: string;
    invalid_type_error?: string;
    invalid_min_length_error?: string;
    invalid_max_length_error?: string;
  } = {},
): Rule<T[]> {
  return function array(ctx) {
    const data: T[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (!Array.isArray(ctx.value)) {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    }

    if (min && ctx.value.length < min) {
      return ctx.error(
        Codes.invalid_min_length,
        invalid_min_length_error,
        { min }
      )
    }

    if (max && ctx.value.length > max) {
      return ctx.error(
        Codes.invalid_max_length,
        invalid_max_length_error,
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
