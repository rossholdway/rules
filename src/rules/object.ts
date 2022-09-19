import { Codes, Rule, Context } from "../mod.ts";
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

export function obj<T>(schema: { [Key in keyof T]: Rule<T[Key]> }): Rule<T> {
  return function obj(ctx) {
    const data = {} as { [Key in keyof T]: T[Key] };

    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (!isObject(ctx.value)) {
      return ctx.error(Codes.invalid_type, "Not an object")
    } else {
      for (const prop in schema) {
        if (!Object.prototype.hasOwnProperty.call(schema, prop)) continue;
        const v = ctx.value[prop];
        const ruleFn = schema[prop as keyof T];
        const result = ruleFn(
          new Context(ruleFn.name, v, [...ctx.path, prop], ctx.errors)
        );

        if (isValidRule(result)) {
          if (typeof result.value !== "undefined") {
            data[prop as keyof T] = result.value;
          }
        }
      }
    }

    return (ctx.errors.length === 0)
      ? {success: true, value: data}
      : {success: false};
  };
}
