import { Codes, Rule, Context, Err } from "../mod.ts";
import { isValidRule } from "../helpers.ts";

/**
 * Object validation
 * *****************************************************************
 */
export type obj = typeof obj;

// deno-lint-ignore no-explicit-any
function isObject(value: any): value is Record<string, unknown> {
  return (!!value) && (value.constructor === Object);
}

export function obj<T>(
  schema: { [Key in keyof T]: Rule<T[Key]> },
  {
    required_error = "is required",
    invalid_type_error = "must be an object"
  } = {}
): Rule<T> {
  return function obj(ctx) {
    const data = {} as { [Key in keyof T]: T[Key] };
    const errors: Err[] = [];

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (!isObject(ctx.value)) {
      return ctx.error(Codes.invalid_type, invalid_type_error)
    } else {
      for (const prop in schema) {
        if (!Object.prototype.hasOwnProperty.call(schema, prop)) continue;
        const v = ctx.value[prop];
        const ruleFn = schema[prop as keyof T];
        const result = ruleFn(
          new Context(ruleFn.name, v, [...ctx.path, prop], errors)
        );

        if (isValidRule(result)) {
          if (typeof result.value !== "undefined") {
            data[prop as keyof T] = result.value;
          }
        }
      }
    }

    if(errors.length === 0) {
      return { success: true, value: data }
    } else {
      ctx.errors.push(...errors);
      return { success: false }
    }
  };
}
