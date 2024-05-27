import type { Rule } from "../mod.ts";

/**
 * Any validation
 * *****************************************************************
 */
export type anything = typeof any;

// deno-lint-ignore no-explicit-any
export function any(): Rule<any> {
  return function any(ctx) {
    return { success: true, value: ctx.value };
  };
}
