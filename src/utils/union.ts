import { Codes, Err, InferTuple, Rule, Context } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

// export function union<A>(ruleSet: [Rule<A>]): Rule<A>;
// export function union<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A | B>;
// export function union<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A | B | C>;
// export function union<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A | B | C | D>;
// export function union(ruleSet: Rule<any>[]): Rule<any>

// Helps to validate that a value matches at least one rule
export function union<T extends Rule<InferTuple<T>[number]>[]>(
  ruleSet: [...T],
): Rule<InferTuple<T>[number]> {
  return function union(ctx) {
    const errors: Err[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    for (const ruleFn of ruleSet) {
      const result = ruleFn(new Context(ruleFn.name, ctx.value, ctx.path, errors));
      if (isValidRule(result)) {
        return result; // We're done
      }
    }

    // If none of the rules are valid we add them
    // to the global errors context
    ctx.error(Codes.invalid_union, "Invalid input")
    ctx.errors.push(...errors);

    return { success: false };
  };
}
