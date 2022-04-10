import { Codes, Rule } from "..";

/**
 * Boolean validation
 * *****************************************************************
 */
 export type bool = typeof boolean;

 export function boolean(): Rule<boolean> {
    const name = "boolean";
    return function boolean(path, value, _ctx) {

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

      if (typeof value !== "boolean") {
        return {
          success: false,
          errors: [{
            value, name, path,
            code: Codes.invalid_type,
            message: "Not a boolean"
          }]
        };
      }
  
      return { success: true, value };
    };
  }
