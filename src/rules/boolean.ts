import { Codes, Rule } from "../mod.ts";

/**
 * Boolean validation
 * *****************************************************************
 */
export type bool = typeof bool;

export function bool(): Rule<boolean> {
  return function bool(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (typeof ctx.value !== "boolean") {
      return ctx.error(Codes.invalid_type, "Not a boolean")
    }

    return { success: true, value: ctx.value };
  };
}
