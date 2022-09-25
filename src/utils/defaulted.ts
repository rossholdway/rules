import type { Context, Rule } from "../mod.ts";

export type defaultedFn<Output> = (ctx: Context) => Required<Output>;

// Provide a default if it's undefined (before validation)
export function defaulted<Output>(
  rule: Rule<Output>,
  defaultFn: defaultedFn<Output>,
): Rule<Output> {
  return function defaulted(ctx) {
    ctx.value = (typeof ctx.value === "undefined") ? defaultFn(ctx) : ctx.value;
    return rule(ctx);
  };
}
