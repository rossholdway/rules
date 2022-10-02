import { Codes, Rule } from "../mod.ts";

/**
 * Enum validation
 * Value is one of a specific set of given number(s) or string(s)
 * *****************************************************************
 */
export type enums = typeof enums;

export function enums<T extends string>(values: readonly T[]): Rule<T>;

export function enums(
  values: readonly unknown[],
  {
    required_error = "is required",
    invalid_enum_error = `must be one of ${values.join(", ")}`
  } = {}
): Rule<string> {
  return function enums(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value === "string" && values.includes(ctx.value)) {
      return { success: true, value: ctx.value };
    } else {
      return ctx.error(
        Codes.invalid_enum,
        invalid_enum_error
      )
    }
  };
}
