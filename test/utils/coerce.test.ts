import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, sandbox, validRule } from "../utils.ts";

import { coerce } from "../../src/utils/coerce.ts";

describe("coerce", function () {
  it("should call callback with expected argument", function () {
    const coerceCb = sandbox.fake.returns("742");
    const util = coerce(validRule, coerceCb);
    util(ctx(util.name, 742));

    sandbox.assert.calledWithExactly(coerceCb, 742);
  });

  it("should call rule with coerced value", function () {
    const coerceCb = sandbox.fake.returns("742");
    const util = coerce(validRule, coerceCb);
    const context = ctx(util.name, 742)
    util(context);

    sandbox.assert.calledWithExactly(validRule, context);
  });
});
