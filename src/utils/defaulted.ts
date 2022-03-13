import { Rule, ctx } from "..";

export type defaultedCb<Output> = (ctx: ctx) => Required<Output>

// Provide a default if it's undefined (before validation)
export function defaulted<Output>(rule: Rule<Output>, defaultFn: defaultedCb<Output>): Rule<Output> {
    return function defaulted(path, value, ctx) {
  
      value = (typeof value === "undefined") ? defaultFn(ctx) : value;
      return rule(path, value, ctx);
    };
  }