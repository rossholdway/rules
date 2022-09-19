import { Codes, Rule } from "../mod.ts";

/**
 * Number validation
 * *****************************************************************
 */
export type num = typeof num;

export function num(
  { max, min, integer }: { max?: number; min?: number; integer?: boolean } = {},
): Rule<number> {
  return function str(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (typeof ctx.value !== "number" || Number.isNaN(ctx.value)) {
      return ctx.error(Codes.invalid_type, "Not a number")
    }

    if (integer && !Number.isInteger(ctx.value)) {
      return ctx.error(Codes.invalid_integer, "Must be an integer")
    }

    if (typeof min !== "undefined" && ctx.value < min) {
      return ctx.error(
        Codes.invalid_min_length,
        `Must not be less than ${min}`,
        { min }
      )
    }

    if (typeof max !== "undefined" && ctx.value > max) {
      return ctx.error(
        Codes.invalid_max_length,
        `Must not be greater than ${max}`,
        { max }
      )
    }

    return { success: true, value: ctx.value };
  };
}
