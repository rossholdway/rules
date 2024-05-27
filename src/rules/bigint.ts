import { Codes, type Rule } from "../mod.ts";

/**
 * BigInt validation
 * *****************************************************************
 */
export type bigInt = typeof bigInt;

export function bigInt(
  {
    required_error = "is required",
    invalid_type_error = "must be a bigInt"
  } = {}
): Rule<bigint> {
  return function bigInt(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value !== "bigint") {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    }

    return { success: true, value: ctx.value };
  };
}
