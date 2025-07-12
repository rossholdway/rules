import { describe, it } from "@std/testing/bdd";

import { ctx, sandbox, validRule } from "../utils.ts";

import { defaulted } from "../../src/utils/defaulted.ts";

describe("defaulted", function () {
  it("should call callback when value is undefined", function () {
    const defaultedFn = sandbox.fake();
    const util = defaulted(validRule, defaultedFn);
    const context = ctx(util.name, undefined);
    util(context);

    sandbox.assert.calledWithExactly(defaultedFn, context);
  });

  it("should call rule with default value when undefined", function () {
    const defaultedFn = sandbox.fake.returns("Max Power");
    const util = defaulted(validRule, defaultedFn);
    const context = ctx(util.name, undefined);

    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });

  it("should call rule with provided value when not undefined", function () {
    const defaultedFn = sandbox.fake();
    const util = defaulted(validRule, defaultedFn);
    const context = ctx(util.name, "Mr. Plow");

    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });
});
