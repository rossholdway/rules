import { Codes, Context, Infer, InferTuple, Rule } from "../mod.ts";
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
): Rule<[...InferTuple<T>]> {
  return function tuple(ctx) {
    const data: unknown[] = [];

    //Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (!Array.isArray(ctx.value)) {
      return ctx.error(Codes.invalid_type, "Must be an array")
    }

    if (
      (ruleSet.length === 0 || ctx.value.length === 0) ||
      (ruleSet.length !== ctx.value.length)
    ) {
      return ctx.error(
        Codes.invalid_length,
        `Invalid number of items. Expected ${ruleSet.length}, got ${ctx.value.length}`,
        { expected: ruleSet.length, actual: ctx.value.length }
      )
    }

    for (const [i, rule] of ruleSet.entries()) {
      const result = rule(
        new Context(rule.name, ctx.value[i], [...ctx.path, i.toString()], ctx.errors)
      );
      if (isValidRule(result)) {
        data.push(result.value);
      }
    }

    return (ctx.errors.length === 0)
      ? { success: true, value: (data as [...InferTuple<T>]) }
      : { success: false };
  };
}
