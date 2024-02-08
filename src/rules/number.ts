import { Codes, Rule } from "../mod.ts";

/**
 * Number validation
 * *****************************************************************
 */
export type num = typeof num;

export function num(
  {
    max, min, integer,
    required_error = "is required",
    invalid_type_error = "must be a number",
    invalid_integer_error = "must be an integer",
    invalid_min_length_error = `must not be less than ${min}`,
    invalid_max_length_error = `must not be more than ${max}`
  }:
  {
    max?: number; min?: number; integer?: boolean;
    required_error?: string;
    invalid_type_error?: string;
    invalid_integer_error?: string;
    invalid_min_length_error?: string;
    invalid_max_length_error?: string;
  } = {}
): Rule<number> {
  return function num(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value !== "number" || Number.isNaN(ctx.value)) {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    }

    if (integer && !Number.isInteger(ctx.value)) {
      return ctx.error(Codes.invalid_integer, invalid_integer_error)
    }

    if (typeof min !== "undefined" && ctx.value < min) {
      return ctx.error(
        Codes.invalid_min_length,
        invalid_min_length_error,
        { min }
      )
    }

    if (typeof max !== "undefined" && ctx.value > max) {
      return ctx.error(
        Codes.invalid_max_length,
        invalid_max_length_error,
        { max }
      )
    }

    return { success: true, value: ctx.value };
  };
}
