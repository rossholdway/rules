import {
  Codes,
  Infer,
  InferTuple,
  Rule,
  UnionToIntersection,
  Context
} from "../mod.ts";

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
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    for (const ruleFn of ruleSet) {
      ruleFn(new Context(ruleFn.name, ctx.value, ctx.path, ctx.errors));
    }

    return (ctx.errors.length === 0)
      ? {
        success: true,
        value: (ctx.value as UnionToIntersection<InferTuple<T>[number]>),
      }
      : { success: false };
  };
}
