import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { num } from "../../src/rules/number.ts";

describe("number", function () {
  const rule = num();

  const invalidInput = [
    null,
    {},
    [],
    "string",
    // 1,
    // 0,
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
    it("should allow type of number", function () {
      expect(rule([], -1, ctx).success).to.be.true;
      expect(rule([], 0, ctx).success).to.be.true;
      expect(rule([], 1, ctx).success).to.be.true;
      expect(rule([], 3.14159265359, ctx).success).to.be.true;
      expect(rule([], Infinity, ctx).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function () {
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    describe("options", function () {
      it("should disallow non integer values", function () {
        const rule = num({ integer: true });
        const result = rule([], 3.14159265359, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_integer");
      });

      it("should disallow input less than min", function () {
        const rule = num({ min: 10 });
        const result = rule([], 5, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max", function () {
        const rule = num({ max: 10 });
        const result = rule([], 20, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_max_length");
      });
    });
  });
});
