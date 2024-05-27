import type { Rule } from "../mod.ts";

export function nullable<Output>(ruleFn: Rule<Output>): Rule<Output | null> {
  return function nullable(ctx) {
    if (ctx.value === null) {
      return { success: true, value: null };
    }

    return ruleFn(ctx);
  };
}
