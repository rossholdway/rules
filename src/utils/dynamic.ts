import { Context } from "../mod.ts";
import type { Rule } from "../mod.ts";

type ExtractValue<T> = T extends Rule<infer U> ? U : never;

// deno-lint-ignore no-explicit-any
export type dynamicFn<O> = (ctx: Context<any>) => O;

// Help to decide what validation to run at runtime
// deno-lint-ignore no-explicit-any
export function dynamic<O extends dynamicFn<Rule<any>>>(decisionFn: O): Rule<ExtractValue<ReturnType<O>>> {
  return function dynamic(ctx) {
    const fn = decisionFn(ctx);
    return fn(new Context(fn.name, ctx.value, ctx.path, ctx.errors));
  };
}