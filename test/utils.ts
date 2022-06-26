import Sinon from "https://cdn.skypack.dev/sinon@13.0.2?dts";
import { afterEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";

export const sandbox = Sinon.createSandbox();

export const ctx: Record<string, never> = {};

// deno-lint-ignore no-explicit-any
export const validRule: any = sandbox.spy(
  function validRule(_path, value, _ctx) {
    return { success: true, value };
  },
);

// deno-lint-ignore no-explicit-any
export const invalidRule: any = sandbox.spy(
  function invalidRule(path, value, _ctx) {
    return {
      success: false,
      errors: [{
        value,
        name: "rule",
        path,
        code: "error_code",
        message: "An error occured",
      }],
    };
  },
);

afterEach(() => {
  sandbox.reset();
});
