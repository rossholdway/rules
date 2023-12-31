import { describe, it } from "std/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { dynamic } from "../../src/utils/dynamic.ts";

describe("dynamic", function () {
  it("should provide the value and context to callback", function () {
    const dynamicFn = sandbox.fake.returns(validRule);
    const util = dynamic(dynamicFn);
    const context = ctx(util.name, "Homer");

    util(context);

    sandbox.assert.calledWithExactly(dynamicFn, context);
  });

  it("should call the rule returned by the callback", function () {
    const dynamicFn = sandbox.fake.returns(validRule);
    const util = dynamic(dynamicFn);
    const context = ctx(util.name, "Homer");

    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });
});
