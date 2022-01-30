import { Rule } from "..";

// Help to decide what validation to run at runtime
export function dynamic<T>(decisionFn: (value: unknown, ctx: unknown) => Rule<T>): Rule<T> {
  return function dynamic(path, value, ctx) {
    return decisionFn(value, ctx)(path, value, ctx);
  };
}