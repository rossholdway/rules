import { expect } from "chai";
import { describe, it } from "@std/testing/bdd";

import { ctx, sandbox, validRule } from "../utils.ts";

import { optional } from "../../src/utils/optional.ts";

describe("optional", function () {
  it("should pass when value is undefined", function () {
    const util = optional(validRule);
    const result = util(ctx(util.name, undefined));

    sandbox.assert.notCalled(validRule);
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function () {
    const util = optional(validRule);
    const context = ctx(util.name, "Flaming Moe");
    util(context);

    sandbox.assert.calledOnceWithExactly(validRule, context);
  });
});
