import { Context } from "../mod.ts";
import type { Invalid, Rule, Valid } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

export type refineCb<Output> = (
  ctx: Context<Output>,
) => Valid<Output> | Invalid;

export function refine<Output>(
  name: string,
  ruleFn: Rule<Output>,
  customFn: refineCb<Output>,
): Rule<Output> {
  return function refine(ctx) {
    // Run initial rule
    const result = ruleFn(
      new Context(name, ctx.value, ctx.path, ctx.errors)
    );
    
    if (!isValidRule(result)) {
      return result;
    }

    // We passed the above, now run the custom rule
    return customFn(
      new Context(name, result.value, ctx.path, ctx.errors)
    );
  };
}
