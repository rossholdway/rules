import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";

import type { Invalid } from "./../../src/mod.ts";
import { tuple } from "../../src/rules/tuple.ts";

describe("tuple", function () {
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

  describe("valid", function () {
    it("should allow valid array of entries", function () {
      const rule = tuple([validRule, validRule]);
      expect(rule([], ["Homer", "Simpson"], ctx).success).to.be.true;
    });

    it("should call each rule in the correct order", function () {
      const rule = tuple([validRule, invalidRule]);
      rule([], ["Homer", "Gumble"], ctx) as Invalid;

      sandbox.assert.callOrder(validRule, invalidRule);
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = tuple([validRule]);
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = tuple([invalidRule]);
      const result = rule([], ["invalid_value"], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = tuple([validRule]);
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    it("should disallow input greater than the provied tuple length", function () {
      const rule = tuple([validRule]);
      const result = rule([], ["Ned", "Flanders"], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({ expected: 1, actual: 2 });
    });

    it("should disallow input less than the provied tuple length", function () {
      const rule = tuple([validRule, validRule]);
      const result = rule([], ["Ned"], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({ expected: 2, actual: 1 });
    });

    it("should disallow a zero input length", function () {
      const rule = tuple([validRule, validRule]);
      const result = rule([], [], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({ expected: 2, actual: 0 });
    });

    describe("path", function () {
      it("should be correct", function () {
        const rule = tuple([validRule, invalidRule]);
        const result = rule([], ["Homer", "Gumble"], ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["1"]);
      });
    });
  });
});
