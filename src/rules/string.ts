import { Codes, Rule } from "../mod.ts";

/**
 * String validation
 * *****************************************************************
 */
export type str = typeof str;

export function str(
  { max, min, trim }: { max?: number; min?: number; trim?: boolean } = {},
): Rule<string> {
  return function str(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (typeof ctx.value !== "string") {
      return ctx.error(Codes.invalid_type, "Not a string");
    }

    if (trim) {
      (ctx.value as string) = ctx.value.trim();
    }

    if (min && ctx.value.length < min) {
      return ctx.error(
        Codes.invalid_min_length,
        `Must not be less than ${min} characters`,
        { min }
      )
    }

    if (max && ctx.value.length > max) {
      return ctx.error(
        Codes.invalid_max_length,
        `Must not be greater than ${max} characters`,
        { max }
      )
    }

    return {success: true, value: ctx.value};
  };
}
