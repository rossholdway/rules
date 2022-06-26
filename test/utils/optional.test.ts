import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { optional } from "../../src/utils/optional.ts";

describe("optional", function () {
  it("should pass when value is undefined", function () {
    const util = optional(validRule);
    const result = util([], undefined, ctx);

    sandbox.assert.notCalled(validRule);
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function () {
    const util = optional(validRule);
    util([], "Flaming Moe", ctx);

    sandbox.assert.calledOnceWithExactly(validRule, [], "Flaming Moe", ctx);
  });
});
