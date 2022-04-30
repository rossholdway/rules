import { expect } from "chai";
import Sinon from "sinon";

import { Invalid } from "../../src";
import { tuple } from "../../src/rules/tuple";

describe("tuple", function() {
  const invalidInput = [
    null,
    {},
    // [],
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
    it("should allow valid array of entries", function() {
      const rule = tuple([this.validRule, this.validRule]);
      expect(rule([], ["Homer", "Simpson"], this.ctx).success).to.be.true;
    });

    it("should call each rule in the correct order", function() {
      const rule = tuple([this.validRule, this.invalidRule]);
      rule([], ["Homer", "Gumble"], this.ctx) as Invalid;

      Sinon.assert.callOrder(this.validRule, this.invalidRule);
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const rule = tuple([this.validRule]);
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function() {
      const rule = tuple([this.invalidRule]);
      const result = rule([], ["invalid_value"], this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function() {
      const rule = tuple([this.validRule]);
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    it("should disallow input greater than the provied tuple length", function() {
      const rule = tuple([this.validRule]);
      const result = rule([], ["Ned", "Flanders"], this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({expected: 1, actual: 2});
    });

    it("should disallow input less than the provied tuple length", function() {
      const rule = tuple([this.validRule, this.validRule]);
      const result = rule([], ["Ned"], this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({expected: 2, actual: 1});
    });

    it("should disallow a zero input length", function() {
      const rule = tuple([this.validRule, this.validRule]);
      const result = rule([], [], this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_length");
      expect(result.errors[0].meta).to.eql({expected: 2, actual: 0});
    });

    describe("path", function() {
      it("should be correct", function() {
        const rule = tuple([this.validRule, this.invalidRule]);
        const result = rule([], ["Homer", "Gumble"], this.ctx) as Invalid;
  
        expect(result.errors[0].path).to.eql(["1"]);
      });
    });

  });

});
