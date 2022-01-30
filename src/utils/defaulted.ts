import { Rule } from "..";

// Provide a default if it's undefined (before validation)
export function defaulted<Output>(rule: Rule<Output>, defaultFn: (value: unknown, ctx: unknown) => Required<Output>): Rule<Output> {
    return function defaulted(path, value, ctx) {
  
      value = (typeof value === "undefined") ? defaultFn(value, ctx) : value;
      return rule(path, value, ctx);
    };
  }