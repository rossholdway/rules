import { Err, Rule } from "..";
import { isValidResult } from "../helpers";

export function intersection<A>(ruleSet: [Rule<A>]): Rule<A>;
export function intersection<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A & B>;
export function intersection<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A & B & C>;
export function intersection<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A & B & C & D>;

// Helps to run multiple rules against a single value
export function intersection(ruleSet: Rule<any>[]): Rule<any> {
  const name = "intersection";
  return function intersection(path, value, ctx) {
    const errors: Err[][] = [];

    // Require a value
    if (typeof value === "undefined") {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "required",
          message: "Required"
        } as Err]
      }
    }

    for (const ruleFn of ruleSet) {
      const result = ruleFn(path, value, ctx);
      if (!isValidResult(result)) {
        errors.push(result.errors);
      }
    }

    return (errors.length === 0) ? { success: true, value } : { success: false, errors: errors.flat() };
  };
}