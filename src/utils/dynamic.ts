import { Rule, ctx } from "..";

export type dynamicCb<Output> = (value: unknown, ctx: ctx) => Rule<Output>;

// Help to decide what validation to run at runtime
export function dynamic<Output>(decisionFn: dynamicCb<Output>): Rule<Output> {
  return function dynamic(path, value, ctx) {
    return decisionFn(value, ctx)(path, value, ctx);
  };
}