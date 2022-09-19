import { Rule } from "../mod.ts";

// Mark as optional
export function optional<Output>(
  ruleFn: Rule<Output>,
): Rule<Output | undefined> {
  return function optional(ctx) {
    if (typeof ctx.value === "undefined") {
      return { success: true, value: undefined };
    }

    return ruleFn(ctx);
  };
}
