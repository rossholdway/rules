import { Codes, Rule } from "../mod.ts";

/**
 * BigInt validation
 * *****************************************************************
 */
export type bigInt = typeof bigInt;

export function bigInt(): Rule<bigint> {
  return function bigInt(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (typeof ctx.value !== "bigint") {
      return ctx.error(Codes.invalid_type, "Not a bigInt")
    }

    return { success: true, value: ctx.value };
  };
}
