import { expect } from "chai";

import { Invalid } from "../../src";
import { array } from "../../src/rules/array";

describe("array", function() {
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
    it("should allow valid array", function() {
      const rule = array(this.validRule);
      expect(rule([], ["Homer"], this.ctx).success).to.be.true;
    });

    it("should support nested arrays", function() {
      const rule = array(array(this.validRule));
      const result = rule([], [["Flanders"]], this.ctx);

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const rule = array(this.validRule);
      const result = rule([], undefined, this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function() {
      const rule = array(this.invalidRule);
      const result = rule([], ["invalid_value"], this.ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function() {
      const rule = array(this.validRule);
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    describe("path", function() {
      it("should provide a correct path", function() {
        const rule = array(this.invalidRule);
        const result = rule([], ["Homer"], this.ctx) as Invalid;
  
        expect(result.errors[0].path).to.eql(["0"]);
      });
      it("should provide a correct path when nested", function() {
        const rule = array(array(this.invalidRule));
        const result = rule([], [["Ned"]], this.ctx) as Invalid;
  
        expect(result.errors[0].path).to.eql(["0","0"]);
      });
    });

    describe("options", function() {

      it("should disallow input less than min length", function() {
        const rule = array(this.validRule, { min: 2 });
        const result = rule([], ["Homer"], this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max length", function() {
        const rule = array(this.validRule, { max: 2 });
        const result = rule([], ["Homer", "Lisa", "Hank Scorpio"], this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_max_length");
      });

    });
  });

});