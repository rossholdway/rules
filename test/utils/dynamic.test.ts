import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { dynamic } from "../../src/utils/dynamic.ts";

describe("dynamic", function () {
  it("should provide the value and context to callback", function () {
    const dynamicCb = sandbox.fake.returns(validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", ctx);

    sandbox.assert.calledWithExactly(dynamicCb, "Homer", ctx);
  });

  it("should call the rule returned by the callback", function () {
    const dynamicCb = sandbox.fake.returns(validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", ctx);

    sandbox.assert.calledWithExactly(validRule, [], "Homer", ctx);
  });
});
