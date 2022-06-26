import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid, Valid } from "./../../src/mod.ts";
import { intersection } from "../../src/utils/intersection.ts";

describe("intersection", function () {
  it("should disallow undefined", function () {
    const util = intersection([validRule]);
    const result = util([], undefined, ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call every rule", function () {
    const util = intersection([validRule, invalidRule, validRule]);
    util([], "Bart", ctx);

    sandbox.assert.calledTwice(validRule);
    sandbox.assert.calledOnce(invalidRule);
  });

  it("should return valid if all rules pass", function () {
    const util = intersection([validRule, validRule, validRule]);
    const result = util([], "Bart", ctx) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("Bart");
  });

  it("should return invalid if any rule fails", function () {
    const util = intersection([validRule, validRule, invalidRule]);
    const result = util([], "Bart", ctx);

    expect(result.success).to.be.false;
  });

  it("should return errors", function () {
    const util = intersection([invalidRule]);
    const result = util([], "Bart", ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors).to.eql([{
      value: "Bart",
      name: "rule",
      path: [],
      code: "error_code",
      message: "An error occured",
    }]);
  });
});
