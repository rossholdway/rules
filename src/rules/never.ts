import { Codes, type Rule } from "../mod.ts";

/**
 * Never (always fail)
 * *****************************************************************
 */
export type nevr = typeof never;

export function never(
  { invalid_error = "is invalid" } = {}
): Rule<never> {
  return function never(ctx) {
    return ctx.error(Codes.invalid, invalid_error)
  };
}
