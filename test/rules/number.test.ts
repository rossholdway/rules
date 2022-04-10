import { expect } from "chai";

import { Invalid } from "../../src";
import { num } from "../../src/rules/number";

describe("number", function() {
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
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should allow type of number", function() {
      expect(rule([], -1, this.ctx).success).to.be.true;
      expect(rule([], 0, this.ctx).success).to.be.true;
      expect(rule([], 1, this.ctx).success).to.be.true;
      expect(rule([], 3.14159265359, this.ctx).success).to.be.true;
      expect(rule([], Infinity, this.ctx).success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    describe("options", function() {

      it("should disallow non integer values", function() {
        const rule = num({integer: true});
        const result = rule([], 3.14159265359, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_integer");
      });

      it("should disallow input less than min", function() {
        const rule = num({min: 10});
        const result = rule([], 5, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max", function() {
        const rule = num({max: 10});
        const result = rule([], 20, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_max_length");
      });

    });

  });

});