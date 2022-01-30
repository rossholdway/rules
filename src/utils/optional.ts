import { Rule } from "..";

// Mark as optional
export function optional<Output>(ruleFn: Rule<Output>): Rule<Output | undefined> {
  const name = "optional";
  return function optional(path, value, ctx) {

    if (typeof value === "undefined") { 
      return { success: true, value };
    }

    return ruleFn(path, value, ctx);
  };
}