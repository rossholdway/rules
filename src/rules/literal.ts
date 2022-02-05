import { Err, Rule } from "..";

/**
 * Literal validation
 * *****************************************************************
 */
 export function literal<T extends boolean>(constant: T): Rule<T>
 export function literal<T extends number>(constant: T): Rule<T>
 export function literal<T extends string>(constant: T): Rule<T>
 export function literal<T extends Record<string | number | symbol, unknown>>(constant: T): Rule<T>
 
//Value is an exact match, using `===` for comparison
export function literal(constant: unknown): Rule<any> {
  const name = "literal";
  return function literal(path, value, ctx) {
    const key = path[path.length - 1];

    const validType = (value === constant);

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

    if (!validType) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_value",
          message: `Value must be '${constant}'`,
        }]
      }
    }

    return { success: true, value };
  };
}