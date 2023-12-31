import { expect } from "chai";
import { describe, it, beforeEach } from "std/testing/bdd.ts";

import type { Invalid } from "./../../src/mod.ts";

import { ctx, invalidRule, validRule } from "../utils.ts";
import { array } from "../../src/rules/array.ts";
import { Err } from "../../src/mod.ts"

describe("array", function () {
  let errors: Err[] = [];

  const invalidInput = [
    null,
    {},
    // [],
    "string",
    1,
    0,
    true,
    false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => {
      return "noop";
    },
    new Set(),
    new Map(),
  ];

  beforeEach(() => {
    errors = [];
  });

  describe("valid", function () {
    it("should allow valid array", function () {
      const rule = array(validRule);
      const result = rule(ctx(rule.name, ["Homer"]));
      expect(result.success).to.be.true;
    });

    it("should support nested arrays", function () {
      const rule = array(array(validRule));
      const result = rule(ctx(rule.name, [["Flanders"]]));

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = array(validRule);
      const result = rule(ctx(rule.name, undefined, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = array(invalidRule);
      const result = rule(ctx(rule.name, ["invalid_value"], errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = array(validRule);
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_type");
      });
    });

    describe("path", function () {
      it("should be correct", function () {
        const rule = array(invalidRule);
        rule(ctx(rule.name, ["Homer"], errors)) as Invalid;

        expect(errors[0].path).to.eql(["0"]);
      });
      it("should be correct when nested", function () {
        const rule = array(array(invalidRule));
        rule(ctx(rule.name, [["Ned"]], errors)) as Invalid;

        expect(errors[0].path).to.eql(["0", "0"]);
      });
    });

    describe("options", function () {
      it("should disallow input less than min length", function () {
        const rule = array(validRule, { min: 2 });
        const result = rule(ctx(rule.name, ["Homer"], errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max length", function () {
        const rule = array(validRule, { max: 2 });
        
        const result = rule(ctx(
          rule.name,
          ["Homer", "Lisa", "Hank Scorpio"],
          errors
        )) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_max_length");
      });
    });
  });
});
