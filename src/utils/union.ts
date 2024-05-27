import type { Err, InferTuple, Rule } from "../mod.ts";
import { Codes, Context } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

// export function union<A>(ruleSet: [Rule<A>]): Rule<A>;
// export function union<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A | B>;
// export function union<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A | B | C>;
// export function union<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A | B | C | D>;
// export function union(ruleSet: Rule<any>[]): Rule<any>

// Helps to validate that a value matches at least one rule
export function union<T extends Rule<InferTuple<T>[number]>[]>(
  ruleSet: [...T],
  { 
    required_error = "is required",
    invalid_union_error = undefined
  }:
  {
    required_error?: string;
    invalid_union_error?: string;
  } = {}
): Rule<InferTuple<T>[number]> {
  return function union(ctx) {
    const errors: Err[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    for (const [i, ruleFn] of ruleSet.entries()) {
      const ruleErrors: Err[] = [];
      const result = ruleFn(
        new Context(ruleFn.name, ctx.value, ctx.path, ruleErrors)
      );

      if (isValidRule(result)) {
        return result; // We're done
      } else {
        // It is helpful to know which union raised the error and where
        ruleErrors.map((e) => {
          e.meta = {
            ...e.meta,
            union: {
              key: (ctx.path.length > 0) ? ctx.path.join('.') : 'value',
              index: i
            }
          }
          return e;
        });
        errors.push(...ruleErrors);
      }
    }

    // If none of the rules are valid we add them
    // to the global errors context
    ctx.error(
      Codes.invalid_union,
      invalid_union_error || 'is invalid'
    );

    ctx.errors.push(...errors);

    return { success: false };
  };
}
