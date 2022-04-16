import { expect } from "chai";

import { Invalid } from "../../src";
import { enums } from "../../src/rules/enum";

describe("enum", function() {
  const rule = enums(["Maggie", "Gerald", "Ling"]);

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
    BigInt(Number.MAX_SAFE_INTEGER),
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should allow any of the predefined values", function() {
      expect(rule([], "Maggie", this.ctx).success).to.be.true;
      expect(rule([], "Gerald", this.ctx).success).to.be.true;
      expect(rule([], "Ling", this.ctx).success).to.be.true;
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
        expect(result.errors[0].code).to.eq("invalid_enum");
      });
    });

    it("should disallow unknown values", function() {
      const result = rule([], "Mr. Sparkle", this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_enum");
    });

  });
});
