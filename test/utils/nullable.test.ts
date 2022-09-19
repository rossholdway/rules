import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { nullable } from "../../src/utils/nullable.ts";

describe("nullable", function () {
  it("should pass when value is null", function () {
    const util = nullable(validRule);
    const result = util(ctx(util.name, null));

    sandbox.assert.notCalled(validRule);
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function () {
    const util = nullable(validRule);
    const context = ctx(util.name, "Flaming Moe");

    util(context);

    sandbox.assert.calledOnceWithExactly(validRule, context);
  });
});
