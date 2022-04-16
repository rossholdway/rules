import { Codes, Rule } from "..";

/**
 * Number validation
 * *****************************************************************
 */
export type num = typeof num;

export function num(
  { max, min, integer }:
  { max?: number, min?: number, integer?: boolean } = {}
): Rule<number> {
  const name = "number";
  return function str(path, value, _ctx) {

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

    if (typeof value !== "number" || Number.isNaN(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_type,
          message: "Not a number"
        }]
      };
    }

    if (integer && !Number.isInteger(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_integer,
          message: "Must be an integer"
        }]
      };
    }

    if (typeof min !== "undefined" && value < min) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_min_length,
          message: `Must not be less than ${min}`,
          meta: { min }
        }]
      };
    }

    if (typeof max !== "undefined" && value > max) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_max_length,
          message: `Must not be greater than ${max}`,
          meta: { max }
        }]
      };
    }

    return { success: true, value };
  };
}
