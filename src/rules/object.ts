import { Codes, Err, Rule } from "../mod.ts";
import { isValidResult } from "../helpers.ts";

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
  const name = "object";
  return function obj(path, value, ctx) {
    const data = {} as { [Key in keyof T]: T[Key] };
    const errors: (Err | Err[])[] = [];

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

    if (!isObject(value)) {
      return {
        success: false,
        errors: [{
          value,
          name,
          path,
          code: Codes.invalid_type,
          message: "Not an object",
        }],
      };
    } else {
      for (const prop in schema) {
        if (!Object.prototype.hasOwnProperty.call(schema, prop)) continue;
        const v = value[prop];

        const ruleFn = schema[prop as keyof T];

        const result = ruleFn([...path, prop], v, ctx);

        if (isValidResult(result)) {
          if (typeof result.value !== "undefined") {
            data[prop as keyof T] = result.value;
          }
        } else {
          errors.push(result.errors);
        }
      }
    }

    return (errors.length === 0)
      ? { success: true, value: data }
      : { success: false, errors: errors.flat() };
  };
}
