import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it, beforeEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid, Valid, Err } from "./../../src/mod.ts";
import { union } from "../../src/utils/union.ts";

describe("union", function () {
  let errors: Err[] = [];

  beforeEach(function () {
    errors = [];
  });

  it("should disallow undefined", function () {
    const util = union([validRule]);
    const result = util(ctx(util.name, undefined, errors)) as Invalid;

    expect(result.success).to.be.false;
    expect(errors[0].code).to.eq("required");
  });

  it("should call each rule until valid", function () {
    const util = union([invalidRule, validRule, invalidRule]);
    util(ctx(util.name, "Moe"));

    sandbox.assert.calledOnce(invalidRule);
    sandbox.assert.calledOnce(validRule);
  });

  it("should return valid on first rule pass", function () {
    const util = union([validRule, validRule, validRule]);
    const result = util(ctx(util.name, "Moe")) as Valid<string>;

    sandbox.assert.calledOnce(validRule);
    expect(result.success).to.be.true;
    expect(result.value).to.eq("Moe");
  });

  it("should return invalid if all rules fail", function () {
    const util = union([invalidRule, invalidRule, invalidRule]);
    const result = util(ctx(util.name, "Homer", errors)) as Invalid;

    expect(result.success).to.be.false;
    expect(errors.length).to.eq(4);
  });

  it("should return errors", function () {
    const util = union([invalidRule]);
    const result = util(ctx(util.name, "Bart", errors)) as Invalid;

    expect(result.success).to.be.false;
    expect(errors).to.eql([
      {
        value: "Bart",
        name: "union",
        path: [],
        code: "invalid_union",
        message: "Invalid input",
        meta: undefined
      },
      {
        value: "Bart",
        name: "invalidRule",
        path: [],
        code: "error_code",
        message: "An error occured",
        meta: undefined
      },
    ]);
  });
});
