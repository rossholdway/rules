import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid, Valid } from "./../../src/mod.ts";
import { union } from "../../src/utils/union.ts";

describe("union", function () {
  it("should disallow undefined", function () {
    const util = union([validRule]);
    const result = util([], undefined, ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call each rule until valid", function () {
    const util = union([invalidRule, validRule, invalidRule]);
    util([], "Moe", ctx);

    sandbox.assert.calledOnce(invalidRule);
    sandbox.assert.calledOnce(validRule);
  });

  it("should return valid on first rule pass", function () {
    const util = union([validRule, validRule, validRule]);
    const result = util([], "Moe", ctx) as Valid<string>;

    sandbox.assert.calledOnce(validRule);
    expect(result.success).to.be.true;
    expect(result.value).to.eq("Moe");
  });

  it("should return invalid if all rules fail", function () {
    const util = union([invalidRule, invalidRule, invalidRule]);
    const result = util([], "Homer", ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors.length).to.eq(4);
  });

  it("should return errors", function () {
    const util = union([invalidRule]);
    const result = util([], "Bart", ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors).to.eql([
      {
        value: "Bart",
        name: "union",
        path: [],
        code: "invalid_union",
        message: "Invalid input",
      },
      {
        value: "Bart",
        name: "rule",
        path: [],
        code: "error_code",
        message: "An error occured",
      },
    ]);
  });
});
