import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { defaulted } from "../../src/utils/defaulted.ts";

describe("defaulted", function () {
  it("should call callback when value is undefined", function () {
    const defaultedCb = sandbox.fake();
    const util = defaulted(validRule, defaultedCb);
    util([], undefined, ctx);

    sandbox.assert.calledWithExactly(defaultedCb, ctx);
  });

  it("should call rule with default value when undefined", function () {
    const defaultedCb = sandbox.fake.returns("Max Power");
    const util = defaulted(validRule, defaultedCb);
    util([], undefined, ctx);

    sandbox.assert.calledWithExactly(validRule, [], "Max Power", ctx);
  });

  it("should call rule with provided value when not undefined", function () {
    const defaultedCb = sandbox.fake();
    const util = defaulted(validRule, defaultedCb);
    util([], "Mr. Plow", ctx);

    sandbox.assert.calledWithExactly(validRule, [], "Mr. Plow", ctx);
  });
});
