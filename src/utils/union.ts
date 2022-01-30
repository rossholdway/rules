import { Rule } from "..";
import { isValidResult } from "../helpers";

export function union<A>(ruleSet: [Rule<A>]): Rule<A>;
export function union<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A | B>;
export function union<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A | B | C>;
export function union<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A | B | C | D>;

// Helps to validate that a value matches at least one rule
export function union(ruleSet: Rule<any>[]): Rule<any> {

  return function union(path, value, ctx) {
    const rule = "union";

    for (const ruleFn of ruleSet) {
      const result = ruleFn(path, value, ctx);
      if (isValidResult(result)) {
        return result;
      }
    }

    return ctx.next(rule, path, value, [], false);
  };
}