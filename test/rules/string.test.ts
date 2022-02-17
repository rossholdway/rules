import { expect } from "chai";

import { ctx, Invalid } from "../../src";
import { str } from "../../src/rules/string";

type Valid = Exclude<ReturnType<ReturnType<str>>, Invalid>;

describe("string", function() {
  let ctx: ctx;
  let rule: ReturnType<str>;

  const invalidInput = [
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
    rule = str();
  });

  describe("valid", function() {
    it("should allow type of string", function() {
      expect(rule([], "a string", ctx).success).to.be.true;
    });

    it("should trim text", function() {
      rule = str({trim: true});
      const result = rule([], " Lisa ", ctx) as Valid;

      expect(result.success).to.be.true;
      expect(result.value).to.eq("Lisa");
    });
  });

  describe("invalid", function() {
    it("should disallow undefined", function() {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid types", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("not_a_string");
      });
    });

    it("should disallow input less than min length", function() {
      rule = str({min: 10});
      const result = rule([], "Homer", ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_min_length");
    });

    it("should disallow input greater than max length", function() {
      rule = str({max: 3});
      const result = rule([], "Lisa", ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("invalid_max_length");
    });

  });


});