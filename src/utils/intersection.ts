import type { Infer, InferTuple, Rule, UnionToIntersection, Err } from "../mod.ts";
import { Codes, Context } from "../mod.ts";

// export function intersection<A>(ruleSet: [Rule<A>]): Rule<A>;
// export function intersection<A, B>(ruleSet: [Rule<A>, Rule<B>]): Rule<A & B>;
// export function intersection<A, B, C>(ruleSet: [Rule<A>, Rule<B>, Rule<C>]): Rule<A & B & C>;
// export function intersection<A, B, C, D>(ruleSet: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<A & B & C & D>;
// export function intersection(ruleSet: Rule<any>[]): Rule<any>

// Helps to run multiple rules against a single value
export function intersection<T extends Rule<Infer<T[number]>>[]>(
  ruleSet: [...T],
  { required_error = "is required" } = {}
): Rule<UnionToIntersection<InferTuple<T>[number]>> {
  return function intersection(ctx) {
    const errors: Err[] = [];
    let value: unknown = ctx.value;

    // Require a value
    if (typeof value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    for (const ruleFn of ruleSet) {
      const result = ruleFn(
        new Context(ruleFn.name, value, ctx.path, errors)
      );

      // Propagate value forward
      if (result.success) {
        value = result.value;
      }
    }

    if(errors.length === 0) {
      return { success: true, value: (value as UnionToIntersection<InferTuple<T>[number]>) }
    } else {
      ctx.errors.push(...errors);
      return { success: false }
    }
  };
}
