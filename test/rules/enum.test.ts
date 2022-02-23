import { expect } from "chai";

import { ctx, Invalid } from "../../src";
import { enums } from "../../src/rules/enum";

describe("enum", function() {
  let ctx: ctx;
  const rule = enums(["Maggie", "Gerald", "Ling"]);

  const invalidInput = [
    "test",
    null,
    {},
    [],
    1,
    true,
    false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  beforeEach(function() {
    ctx = {};
  });

  describe("valid", function() {
    it("should allow any of the predefined values", function() {
      expect(rule([], "Maggie", ctx).success).to.be.true;
      expect(rule([], "Gerald", ctx).success).to.be.true;
      expect(rule([], "Ling", ctx).success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_enum");
      });
    });

    it("should disallow unknown values", function() {
      const result = rule([], "Mr. Sparkle", ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_enum");
    });

  });
});