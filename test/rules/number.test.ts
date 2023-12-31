import { expect } from "chai";
import { describe, it, beforeEach } from "std/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { num } from "../../src/rules/number.ts";

describe("number", function () {
  let errors: Err[] = [];
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

  beforeEach(() => {
    errors = [];
  });

  describe("valid", function () {
    it("should allow type of number", function () {
      expect(rule(ctx(rule.name, -1)).success).to.be.true;
      expect(rule(ctx(rule.name, 0)).success).to.be.true;
      expect(rule(ctx(rule.name, 1)).success).to.be.true;
      expect(rule(ctx(rule.name, 3.14159265359)).success).to.be.true;
      expect(rule(ctx(rule.name, Infinity)).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const result = rule(ctx(rule.name, undefined, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function () {
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_type");
      });
    });

    describe("options", function () {
      it("should disallow non integer values", function () {
        const rule = num({ integer: true });
        const result = rule(ctx(rule.name, 3.14159265359, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_integer");
      });

      it("should disallow input less than min", function () {
        const rule = num({ min: 10 });
        const result = rule(ctx(rule.name, 5, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max", function () {
        const rule = num({ max: 10 });
        const result = rule(ctx(rule.name, 20, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_max_length");
      });
    });
  });
});
