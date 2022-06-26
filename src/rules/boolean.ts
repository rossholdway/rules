import { Codes, Rule } from "../mod.ts";

/**
 * Boolean validation
 * *****************************************************************
 */
export type bool = typeof bool;

export function bool(): Rule<boolean> {
  const name = "boolean";
  return function bool(path, value, _ctx) {
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

    if (typeof value !== "boolean") {
      return {
        success: false,
        errors: [{
          value,
          name,
          path,
          code: Codes.invalid_type,
          message: "Not a boolean",
        }],
      };
    }

    return { success: true, value };
  };
}
