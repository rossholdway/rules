import Sinon from "https://cdn.skypack.dev/sinon@13.0.2?dts";
import { afterEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";
import { Err, Context } from "../src/mod.ts";

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
