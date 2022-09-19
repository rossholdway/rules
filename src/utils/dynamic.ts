import { Context } from "../mod.ts";
import type { Rule } from "../mod.ts";

export type dynamicCb<Output> = (ctx: Context) => Rule<Output>;

// Help to decide what validation to run at runtime
export function dynamic<Output>(decisionFn: dynamicCb<Output>): Rule<Output> {
  return function dynamic(ctx) {
    const fn = decisionFn(ctx);
    return fn(new Context(fn.name, ctx.value, ctx.path, ctx.errors));
  };
}
