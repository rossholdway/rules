import { expect } from "chai";
import { describe, it, beforeEach } from "std/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid, Err } from "./../../src/mod.ts";
import { tuple } from "../../src/rules/tuple.ts";

describe("tuple", function () {
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
    it("should allow valid array of entries", function () {
      const rule = tuple([validRule, validRule]);
      const result = rule(ctx(rule.name, ["Homer", "Simpson"]));
      
      expect(result.success).to.be.true;
    });

    it("should call each rule in the correct order", function () {
      const rule = tuple([validRule, invalidRule]);
      rule(ctx(rule.name, ["Homer", "Gumble"])) as Invalid;

      sandbox.assert.callOrder(validRule, invalidRule);
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = tuple([validRule]);
      const result = rule(ctx(rule.name, undefined, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = tuple([invalidRule]);
      const result = rule(ctx(rule.name, ["invalid_value"], errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = tuple([validRule]);
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_type");
      });
    });

    it("should disallow input greater than the provied tuple length", function () {
      const rule = tuple([validRule]);
      const result = rule(ctx(rule.name, ["Ned", "Flanders"], errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("invalid_length");
      expect(errors[0].meta).to.eql({ expected: 1, actual: 2 });
    });

    it("should disallow input less than the provied tuple length", function () {
      const rule = tuple([validRule, validRule]);
      const result = rule(ctx(rule.name, ["Ned"], errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("invalid_length");
      expect(errors[0].meta).to.eql({ expected: 2, actual: 1 });
    });

    it("should disallow a zero input length", function () {
      const rule = tuple([validRule, validRule]);
      const result = rule(ctx(rule.name, [], errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("invalid_length");
      expect(errors[0].meta).to.eql({ expected: 2, actual: 0 });
    });

    describe("path", function () {
      it("should be correct", function () {
        const rule = tuple([validRule, invalidRule]);
        rule(ctx(rule.name, ["Homer", "Gumble"], errors)) as Invalid;

        expect(errors[0].path).to.eql(["1"]);
      });
    });
  });
});
