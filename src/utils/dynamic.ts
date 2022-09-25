import { Context } from "../mod.ts";
import { isValidRule } from "../helpers.ts";
import type { Rule } from "../mod.ts";

// deno-lint-ignore no-explicit-any
export type dynamicFn<O> = (ctx: Context<any>) => O;

// Help to decide what validation to run at runtime
// deno-lint-ignore no-explicit-any
export function dynamic<O extends Rule<any>>(decisionFn: dynamicFn<O>): O {

  return function dynamic(ctx) {
    const fn = decisionFn(ctx);
    return fn(new Context(fn.name, ctx.value, ctx.path, ctx.errors));
  } as O;
}

// as 0 requried, otherwise we get the error assignable to the constraint
// of type 'T', but 'T' could be instantiated with a different subtype of constraint.
// Not sure how to solve this... moving on for now.