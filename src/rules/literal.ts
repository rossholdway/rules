import { Rule } from "..";

/**
 * Literal validation
 * *****************************************************************
 */
export type literal = typeof literal;

export function literal<T extends boolean>(constant: T): Rule<T>
export function literal<T extends number>(constant: T): Rule<T>
export function literal<T extends string>(constant: T): Rule<T>
export function literal<T extends Record<string | number | symbol, unknown>>(constant: T): Rule<T>
 
//Value is an exact match, using `===` for comparison
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function literal(constant: unknown): Rule<any> {
  const name = "literal";
  return function literal(path, value, _ctx) {
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
        }]
      };
    }

    if (!validType) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_value",
          message: `Value must be '${constant}'`,
        }]
      };
    }

    return { success: true, value };
  };
}