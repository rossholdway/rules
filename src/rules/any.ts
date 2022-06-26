import { Rule } from "../mod.ts";

/**
 * Any validation
 * *****************************************************************
 */
export type anything = typeof any;

// deno-lint-ignore no-explicit-any
export function any(): Rule<any> {
  return function any(_path, value, _ctx) {
    return { success: true, value };
  };
}
