import { Codes, Rule } from "../mod.ts";

/**
 * Boolean validation
 * *****************************************************************
 */
export type bool = typeof bool;

export function bool(
  {
    required_error = "is required",
    invalid_type_error = "must be a boolean"
  } = {}
): Rule<boolean> {
  return function bool(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value !== "boolean") {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    }

    return { success: true, value: ctx.value };
  };
}
