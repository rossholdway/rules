import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { defaulted } from "../../src/utils/defaulted.ts";

describe("defaulted", function () {
  it("should call callback when value is undefined", function () {
    const defaultedCb = sandbox.fake();
    const util = defaulted(validRule, defaultedCb);
    const context = ctx(util.name, undefined);
    util(context);

    sandbox.assert.calledWithExactly(defaultedCb, context);
  });

  it("should call rule with default value when undefined", function () {
    const defaultedCb = sandbox.fake.returns("Max Power");
    const util = defaulted(validRule, defaultedCb);
    const context = ctx(util.name, undefined);

    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });

  it("should call rule with provided value when not undefined", function () {
    const defaultedCb = sandbox.fake();
    const util = defaulted(validRule, defaultedCb);
    const context = ctx(util.name, "Mr. Plow");

    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });
});
