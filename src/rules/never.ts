import { Codes, Rule } from "..";

/**
 * Never (always fail)
 * *****************************************************************
 */
 export type nevr = typeof never;

 export function never(): Rule<never> {
    const name = "never";
    return function never(path, value, _ctx) { 
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid,
          message: "Invalid"
        }]
      };
    };
  }
