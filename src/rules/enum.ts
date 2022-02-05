import { Err, Rule } from "..";

/**
 * Enum validation
 * Value is one of a specific set of given TS enum object or array of strings / numbers
 * *****************************************************************
 */
 type EnumLike = { [k: string]: string | number; };
 export function enums<T extends EnumLike>(values: T): Rule<string|number> {
   const name = "enums";
   return function enums(path, value, ctx) {
     const key = path[path.length - 1];
 
     // Require a value
     if (typeof value === "undefined") {
       return {
        success: false,
        errors: [{
          value, name, path,
          code: "required",
          message: `${key} is required`
        } as Err]
      }
     }
 
     const validKeys = Object.keys(values).filter(
       (k) => typeof values[values[k]] !== "number"
     ).map((k) => values[k]);

     if (typeof value !== "string" && typeof value !== "number") {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "not_a_string_or_number",
          message: "Value must be either a string or number"
        }]
      }
     }
     if (!validKeys.includes(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_enum",
          message: `Must be one of ${validKeys.join(", ")}`
        }]
      }
     }

     return { success: true, value };
   };
 }
 