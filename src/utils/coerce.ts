import { Rule } from "../mod.ts";

export type coerceFn<Output> = (value: unknown) => Required<Output> | unknown;

// Coerce a value into another allowing you to transform input data (before validation)
export function coerce<Output>(
  ruleFn: Rule<Output>,
  coercionFn: coerceFn<Output>,
): Rule<Output> {
  return function coerce(ctx) {
    ctx.value = coercionFn(ctx.value);
    return ruleFn(ctx);
  };
}
