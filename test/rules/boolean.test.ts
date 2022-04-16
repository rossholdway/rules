import { expect } from "chai";

import { Invalid } from "../../src";
import { bool } from "../../src/rules/boolean";

describe("boolean", function() {
  const rule = bool();

  const invalidInput = [
    null,
    {},
    [],
    "string",
    1,
    0,
    // true,
    // false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should allow type of boolean", function() {
      expect(rule([], true, this.ctx).success).to.be.true;
      expect(rule([], false, this.ctx).success).to.be.true;
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
  });

});
