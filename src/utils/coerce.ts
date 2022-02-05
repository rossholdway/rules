import { Rule } from "..";

export type coerceCb<Output> = (value: unknown) => Required<Output>| null;

// Coerce a value into another allowing you to transform input data (before validation)
export function coerce<Output>(ruleFn: Rule<Output>, coercionFn: coerceCb<Output>): Rule<Output> {
  const name = "coerce";
  return function coerce(path, value, ctx) {
    const coercedValue = coercionFn(value);
    if (coercedValue === null) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "coercion_failure",
          message: "Value could not be coerced"
        }]
      }
    }
    return ruleFn(path, coercedValue, ctx);
  };
}
  