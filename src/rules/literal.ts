// deno-lint-ignore-file no-explicit-any
import { Codes, Rule } from "../mod.ts";

/**
 * Literal validation
 * *****************************************************************
 */
export type literal = typeof literal;

export function literal<T extends boolean>(constant: T, options?: {
  required_error?: string | undefined;
  invalid_literal_error?: string | undefined;
}): Rule<T>;
export function literal<T extends number>(constant: T, options?: {
  required_error?: string | undefined;
  invalid_literal_error?: string | undefined;
}): Rule<T>;
export function literal<T extends string>(constant: T, options?: {
  required_error?: string | undefined;
  invalid_literal_error?: string | undefined;
}): Rule<T>;
export function literal<T>(constant: T, options?: {
  required_error?: string | undefined;
  invalid_literal_error?: string | undefined;
}): Rule<T>;

// Value is an exact match, using `===` for comparison
export function literal(
  constant: any,
  {
    required_error = "is required",
    invalid_literal_error = `expected '${constant}'`
  } = {}
): Rule<any> {
  return function literal(ctx) {
    const validType = (ctx.value === constant);

    // Require a value
    if (typeof ctx.value === "undefined" && constant !== undefined) {
      return ctx.error(Codes.required, required_error);
    }

    if (!validType) {
      return ctx.error(
        Codes.invalid_literal,
        invalid_literal_error,
        { constant }
      );
    }

    return { success: true, value: ctx.value };
  };
}
