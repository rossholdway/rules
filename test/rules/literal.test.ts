import { expect } from "chai";

import { Invalid } from "../../src";
import { literal } from "../../src/rules/literal";

describe("literal", function() {
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

    it("should allow literal type null", function() {
      const rule = literal(null);
      expect(rule([], null, this.ctx).success).to.be.true;
    });

    it("should allow literal type undefined", function() {
      const rule = literal(undefined);
      expect(rule([], undefined, this.ctx).success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined when undefined is not constant", function() {
      const rule = literal("Homer");
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input", function() {
      const rule = literal("Homer");
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_literal");
      });
    });
  });

});
