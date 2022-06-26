import { Codes, Rule } from "../mod.ts";

/**
 * BigInt validation
 * *****************************************************************
 */
export type bigInt = typeof bigInt;

export function bigInt(): Rule<bigint> {
  const name = "bigInt";
  return function str(path, value, _ctx) {
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

    if (typeof value !== "bigint") {
      return {
        success: false,
        errors: [{
          value,
          name,
          path,
          code: Codes.invalid_type,
          message: "Not a bigInt",
        }],
      };
    }

    return { success: true, value };
  };
}
