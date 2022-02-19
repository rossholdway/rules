import { expect } from "chai";

import { ctx, Invalid } from "../../src";
import { array } from "../../src/rules/array";
import { str } from "../../src/rules/string";

describe("array", function() {
  let ctx: ctx;
  let rule: ReturnType<array>;

  const invalidInput = [
    "test",
    null,
    {},
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
    rule = array(str());
  });

  describe("valid", function() {
    it("should allow passing rule", function() {
      expect(rule([], ["Homer"], ctx).success).to.be.true;
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function() {
      const result = rule([], [1], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("not_a_string");
    });

    it("should disallow invalid input type", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    it("should provide the correct path", function() {
      const result = rule([], ["Homer", 1], ctx) as Invalid;

      expect(result.errors[0].path).to.eql(["1"]);
    });

    describe("options", function() {

      it("should disallow input less than min length", function() {
        const rule = array(str(), { min: 2 });
        const result = rule([], ["Homer"], ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max length", function() {
        const rule = array(str(), { max: 2 });
        const result = rule([], ["Homer", "Lisa", "Hank Scorpio"], ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_max_length");
      });

    });
  });

});