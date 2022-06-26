import { Codes, Err, InferTuple, Rule } from "../mod.ts";
import { isValidResult } from "../helpers.ts";

// export function union<A>(ruleSet: [Rule<A>]): Rule<A>;
// export function union<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A | B>;
// export function union<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A | B | C>;
// export function union<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A | B | C | D>;
// export function union(ruleSet: Rule<any>[]): Rule<any>

// Helps to validate that a value matches at least one rule
export function union<T extends Rule<InferTuple<T>[number]>[]>(
  ruleSet: [...T],
): Rule<InferTuple<T>[number]> {
  const name = "union";

  return function union(path, value, ctx) {
    const errors: Err[][] = [];

    // Require a value
    if (typeof value === "undefined") {
      return {
        success: false,
        errors: [{
          value,
          name,
          path,
          code: Codes.required,
          message: "Required",
        }],
      };
    }

    for (const ruleFn of ruleSet) {
      const result = ruleFn(path, value, ctx);
      if (isValidResult(result)) {
        return result; // We're done
      } else {
        errors.push(result.errors);
      }
    }

    return {
      success: false,
      errors: [
        {
          value,
          name,
          path,
          code: Codes.invalid_union,
          message: "Invalid input",
        },
        ...errors.flat(),
      ],
    };
  };
}
