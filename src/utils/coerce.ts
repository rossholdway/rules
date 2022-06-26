import { Rule } from "../mod.ts";

export type coerceCb<Output> = (value: unknown) => Required<Output> | unknown;

// Coerce a value into another allowing you to transform input data (before validation)
export function coerce<Output>(
  ruleFn: Rule<Output>,
  coercionFn: coerceCb<Output>,
): Rule<Output> {
  return function coerce(path, value, ctx) {
    const coercedValue = coercionFn(value);
    return ruleFn(path, coercedValue, ctx);
  };
}
