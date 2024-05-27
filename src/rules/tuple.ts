import type { Infer, InferTuple, Rule, Err } from "../mod.ts";
import { Codes, Context } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

/**
 * Tuple validation
 * *****************************************************************
 */
export type tuple = typeof tuple;

// export function tuple<A>(rules: [Rule<A>]): Rule<[A]>;
// export function tuple<A, B>(rules: [Rule<A>, Rule<B>]): Rule<[A, B]>;
// export function tuple<A, B, C>(rules: [Rule<A>, Rule<B>, Rule<C>]): Rule<[A, B, C]>;
// export function tuple<A, B, C, D>(rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<[A, B, C, D]>;
// export function tuple(rules: Rule<any>[]): Rule<any>

export function tuple<T extends Rule<Infer<T[number]>>[]>(
  ruleSet: [...T],
  {
    required_error = "is required",
    invalid_type_error = "must be an array",
    invalid_length_error = `has invalid number of items. Expected ${ruleSet.length}`,
  } = {}
): Rule<[...InferTuple<T>]> {
  return function tuple(ctx) {
    const data: unknown[] = [];
    const errors: Err[] = [];

    //Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (!Array.isArray(ctx.value)) {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    }

    if (
      (ruleSet.length === 0 || ctx.value.length === 0) ||
      (ruleSet.length !== ctx.value.length)
    ) {
      return ctx.error(
        Codes.invalid_length,
        invalid_length_error,
        { expected: ruleSet.length, actual: ctx.value.length }
      )
    }

    for (const [i, rule] of ruleSet.entries()) {
      const result = rule(
        new Context(rule.name, ctx.value[i], [...ctx.path, i.toString()], errors)
      );
      if (isValidRule(result)) {
        data.push(result.value);
      }
    }

    if(errors.length === 0) {
      return { success: true, value: (data as [...InferTuple<T>]) }
    } else {
      ctx.errors.push(...errors);
      return { success: false }
    }
  };
}
