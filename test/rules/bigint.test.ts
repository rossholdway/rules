import { expect } from "chai";

import { Invalid } from "../../src";
import { bigInt } from "../../src/rules/bigint";

describe("bigInt", function() {
  const rule = bigInt();

  const invalidInput = [
    null,
    {},
    [],
    "string",
    1,
    0,
    true,
    false,
    Symbol("test"),
    // BigInt(Number.MAX_SAFE_INTEGER),
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should allow type of bigint", function() {
      expect(rule([], 100n, this.ctx).success).to.be.true;
      expect(rule([], BigInt(9007199254740991), this.ctx).success).to.be.true;
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
