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
    let errors: Err[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    for (const ruleFn of ruleSet) {
      const result = ruleFn(new Context(ruleFn.name, ctx.value, ctx.path, errors));
      if (isValidRule(result)) {
        return result; // We're done
      }
    }

    // If none of the rules are valid we add them
    // to the global errors context
    const uniqueErrorsByMsg = [...new Map(errors.map(e => [e.message, e])).values()];

    ctx.error(
      Codes.invalid_union,
      invalid_union_error || `is invalid. ${uniqueErrorsByMsg
        .filter((e) => e.path.length === ctx.path.length)
        .map((e, i) => (i === 0) ? (e.message[0].toUpperCase() + e.message.slice(1)) : `${e.message}`)
        .join(" or ")}`
    );
    
    // It is helpful to know the error was rasied by a union
    errors = errors.map((e) => e.meta = {
      ...e,
      meta: { ...e.meta, union: (ctx.path.length > 0) ? ctx.path.join('.') : 'value' }
    });

    ctx.errors.push(...errors);

    return { success: false };
  };
}
