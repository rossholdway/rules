import { expect } from "chai";

import { ctx, Invalid } from "../../src";
import { literal } from "../../src/rules/literal";

describe("literal", function() {
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

  describe("valid", function() {
    it("should allow literal type string", function() {
      const rule = literal("Homer");
      expect(rule([], "Homer", this.ctx).success).to.be.true;
    });

    it("should allow literal type number", function() {
      const rule = literal(42);
      expect(rule([], 42, this.ctx).success).to.be.true;
    });

    it("should allow literal type boolean", function() {
      const rule = literal(true);
      expect(rule([], true, this.ctx).success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const rule = literal("Homer");
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function() {
      const rule = literal("Homer");
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_value");
      });
    });
  });

});