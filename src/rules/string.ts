import { Rule } from "..";

/**
 * String validation
 * *****************************************************************
 */
 export type str = typeof str;

 export function str(
    { max, min, trim }:
    { max?: number, min?: number, trim?: boolean } = {}
  ): Rule<string> {
    const name = "string";
    return function str(path, value, _ctx) {

      // Require a value
      if (typeof value === "undefined") {
        return {
          success: false,
          errors: [{
            value, name, path,
            code: "required",
            message: "Required"
          }]
        };
      }

      if (typeof value !== "string") {
        return {
          success: false,
          errors: [{
            value, name, path,
            code: "not_a_string",
            message: "Not a string"
          }]
        };
      }

      if (trim) {
        (value as string) = value.trim();
      }
  
      if (min && value.length < min) {
        return {
          success: false,
          errors: [{
            value, name, path,
            code: "invalid_min_length",
            message: `Must not be less than ${min} characters`
          }]
        };
      }

      if (max && value.length > max) {
        return {
          success: false,
          errors: [{
            value, name, path,
            code: "invalid_max_length",
            message: `Must not be greater than ${max} characters`
          }]
        };
      }
  
      return { success: true, value };
    };
  }
