import { Rule } from "..";

export function nullable<Output>(ruleFn: Rule<Output>): Rule<Output | null> {
  return function optional(path, value, ctx) {

    if (value === null) { 
      return { success: true, value };
    }

    return ruleFn(path, value, ctx);
  };
}
