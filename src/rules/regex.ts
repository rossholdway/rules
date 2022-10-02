import { Codes, Rule } from "../mod.ts";

/**
 * Regular exporession validation
 * *****************************************************************
 */
export type regex = typeof regex;

export function regex(
  regex: RegExp,
  {
    required_error = "is required",
    invalid_type_error = "must be a string",
    regex_no_match_error = "is not in the expected format"
  } = {}
): Rule<string> {
  return function str(ctx) {
    // Require a value
    if (typeof ctx.value === "undefined") {
      return ctx.error(Codes.required, required_error)
    }

    if (typeof ctx.value !== "string") {
      return ctx.error(Codes.invalid_type, invalid_type_error);
    }

    if (!regex.test(ctx.value)) {
      return ctx.error(Codes.regex_no_match, regex_no_match_error);
    }

    return {success: true, value: ctx.value};
  };
}
