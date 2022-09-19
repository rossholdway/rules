import { Codes, Rule } from "../mod.ts";

/**
 * Never (always fail)
 * *****************************************************************
 */
export type nevr = typeof never;

export function never(): Rule<never> {
  return function never(ctx) {
    return ctx.error(Codes.invalid, "Invalid")
  };
}
