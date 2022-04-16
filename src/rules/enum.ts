import { Codes, Rule } from "..";

/**
 * Enum validation
 * Value is one of a specific set of given number(s) or string(s)
 * *****************************************************************
 */
export type enums = typeof enums;

export function enums<T extends string>(values: readonly T[]): Rule<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enums(values: readonly unknown[]): Rule<string> {
  const name = "enums";
  return function enums(path, value, _ctx) {

    // Require a value
    if (typeof value === "undefined") {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.required,
          message: "Required"
        }]
      };
    }
    
    if (typeof value === "string" && values.includes(value)) {
      return { success: true, value };
    } else {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_enum,
          message: `Must be one of ${values.join(", ")}`
        }]
      };
    }

  };
}
