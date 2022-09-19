import { Codes, Rule } from "../mod.ts";

/**
 * Literal validation
 * *****************************************************************
 */
export type literal = typeof literal;

export function literal<T extends boolean>(constant: T): Rule<T>;
export function literal<T extends number>(constant: T): Rule<T>;
export function literal<T extends string>(constant: T): Rule<T>;
export function literal<T>(constant: T): Rule<T>;

// Value is an exact match, using `===` for comparison
// deno-lint-ignore no-explicit-any
export function literal(constant: any): Rule<any> {
  return function literal(ctx) {
    const validType = (ctx.value === constant);

    // Require a value
    if (typeof ctx.value === "undefined" && constant !== undefined) {
      return ctx.error(Codes.required, "Required");
    }

    if (!validType) {
      return ctx.error(
        Codes.invalid_literal,
        `Expected ${constant}`,
        { constant }
      );
    }

    return { success: true, value: ctx.value };
  };
}
