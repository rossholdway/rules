import { expect } from "chai";

import { ctx, Invalid } from "../../src";
import { obj } from "../../src/rules/object";
import { str } from "../../src/rules/string";

describe("object", function() {
  let ctx: ctx;
  const rule = obj({ test: str() });

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

  beforeEach(function() {
    ctx = {};
  });

  describe("valid", function() {
    it("should allow valid object", function() {
      expect(rule([], { test: "Bart" }, ctx).success).to.be.true;
    });

    it("should support nested objects", function() {
      const rule = obj({ one: obj({ two: str() }) });
      const result = rule([], { one: { two: "Bart" }}, ctx);

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function() {
      const result = rule([], { test: true }, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("not_a_string");
    });

    it("should disallow invalid input type", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("not_an_object");
      });
    });

    describe("path", function() {
      it("should provide a correct path", function() {
        const result = rule([], { test: 1 }, ctx) as Invalid;
  
        expect(result.errors[0].path).to.eql(["test"]);
      });

      it("should provide a correct path when nested", function() {
        const rule = obj({ one: obj({ two: str() }) });
        const result = rule([], { one: { two: true }}, ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["one","two"]);
      });
    });

  });
});