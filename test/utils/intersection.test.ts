import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it, beforeEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid, Valid, Err } from "./../../src/mod.ts";
import { intersection } from "../../src/utils/intersection.ts";

describe("intersection", function () {
  let errors: Err[] = [];

  beforeEach(() => {
    errors = [];
  });

  it("should disallow undefined", function () {
    const util = intersection([validRule]);
    const result = util(ctx(util.name, undefined, errors)) as Invalid;

    expect(result.success).to.be.false;
    expect(errors[0].code).to.eq("required");
  });

  it("should call every rule", function () {
    const util = intersection([validRule, invalidRule, validRule]);
    util(ctx(util.name, "Bart"));

    sandbox.assert.calledTwice(validRule);
    sandbox.assert.calledOnce(invalidRule);
  });

  it("should return valid if all rules pass", function () {
    const util = intersection([validRule, validRule, validRule]);
    const result = util(ctx(util.name, "Bart")) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("Bart");
  });

  it("should return invalid if any rule fails", function () {
    const util = intersection([validRule, validRule, invalidRule]);
    const result = util(ctx(util.name, "Bart"));

    expect(result.success).to.be.false;
  });

  it("should return errors", function () {
    const util = intersection([invalidRule]);
    const result = util(ctx(util.name, "Bart", errors)) as Invalid;

    expect(result.success).to.be.false;
    expect(errors).to.eql([{
      value: "Bart",
      name: "invalidRule",
      path: [],
      code: "error_code",
      message: "An error occured",
      meta: undefined
    }]);
  });
});
