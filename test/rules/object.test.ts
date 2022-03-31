import { expect } from "chai";

import { Invalid } from "../../src";
import { obj } from "../../src/rules/object";
import { str } from "../../src/rules/string";

describe("object", function() {
  const invalidInput = [
    "test",
    null,
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
    it("should allow valid object", function() {
      const rule = obj({ test: this.validRule });
      expect(rule([], { test: "Bart" }, this.ctx).success).to.be.true;
    });

    it("should support nested objects", function() {
      const rule = obj({ one: obj({ two: str() }) });
      const result = rule([], { one: { two: "Bart" }}, this.ctx);

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const rule = obj({ test: this.validRule });
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function() {
      const rule = obj({ test: this.invalidRule });
      const result = rule([], { test: "invalid_value" }, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function() {
      const rule = obj({ test: this.validRule });
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("not_an_object");
      });
    });

    describe("path", function() {
      it("should provide a correct path", function() {
        const rule = obj({ test: this.invalidRule });
        const result = rule([], { test: "invalid_value" }, this.ctx) as Invalid;
  
        expect(result.errors[0].path).to.eql(["test"]);
      });

      it("should provide a correct path when nested", function() {
        const rule = obj({ one: obj({ two: this.invalidRule }) });
        const result = rule([], { one: { two: "Bart" }}, this.ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["one","two"]);
      });
    });

  });
});