import { Codes, type Rule } from "../mod.ts";

/**
 * String validation
 * *****************************************************************
 */
export type str = typeof str;

export function str(
  {
    max, min, trim,
    required_error = "is required",
    invalid_type_error = "must be a string",
    invalid_min_length_error = `must not be less than ${min} character${min === 1 ? '' : 's'}`,
    invalid_max_length_error = `must not be more than ${max} character${max === 1 ? '' : 's'}`
  }: 
  {
    max?: number; min?: number; trim?: boolean;
    required_error?: string;
    invalid_type_error?: string;
    invalid_min_length_error?: string;
    invalid_max_length_error?: string;
  } = {}
): Rule<string> {
  return function str(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value !== "string") {
      return ctx.error(Codes.invalid_type, invalid_type_error);
    }

    if (trim) {
      (ctx.value as string) = ctx.value.trim();
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

    return {success: true, value: ctx.value};
  };
}
