import { Codes, Rule } from "..";

/**
 * Literal validation
 * *****************************************************************
 */
export type literal = typeof literal;

export function literal<T extends boolean>(constant: T): Rule<T>
export function literal<T extends number>(constant: T): Rule<T>
export function literal<T extends string>(constant: T): Rule<T>
export function literal<T>(constant: T): Rule<T>
 
// Value is an exact match, using `===` for comparison
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function literal(constant: any): Rule<any> {
  const name = "literal";
  return function literal(path, value, _ctx) {
    const validType = (value === constant);

    // Require a value
    if (typeof value === "undefined" && constant !== undefined) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.required,
          message: "Required"
        }]
      };
    }

    if (!validType) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_literal,
          message: `Expected ${constant}`,
          meta: { constant }
        }]
      };
    }

    return { success: true, value };
  };
}