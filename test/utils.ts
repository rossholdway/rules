// @deno-types="npm:@types/sinon"
import Sinon from "sinon";
import { afterEach } from "@std/testing/bdd";
import { type Err, Context } from "../src/mod.ts";

export const sandbox = Sinon.createSandbox();

export const ctx = (name = "", value: unknown, errors: Err[] = [], path: string[] = [], ) => {
  return new Context(name, value, path, errors);
}



// deno-lint-ignore no-explicit-any
export const validRule: any = sandbox.spy(
  function validRule(ctx) {
    return { success: true, value: ctx.value };
  },
);

// deno-lint-ignore no-explicit-any
export const invalidRule: any = sandbox.spy(
  function invalidRule(ctx) {
    return ctx.error("error_code", "An error occured")
  },
);

afterEach(() => {
  sandbox.reset();
});
