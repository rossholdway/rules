import { Codes, Rule } from "../mod.ts";

/**
 * Regular exporession validation
 * *****************************************************************
 */
export type regex = typeof regex;

export function regex(
  regex: RegExp,
): Rule<string> {
  return function str(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, "Required")
    }

    if (typeof ctx.value !== "string") {
      return ctx.error(Codes.invalid_type, "Not a string");
    }

    if (!regex.test(ctx.value)) {
      return ctx.error(Codes.regex_no_match, "Invalid format");
    }

    return {success: true, value: ctx.value};
  };
}
