import { expect } from "chai";
import sinon from "sinon";

import { ctx, Invalid, InvalidRefined, Rule, Valid } from "../../src";
import { refine } from "../../src/utils/refine";
import Sinon from "sinon";

describe("refine", function() {
  let ctx: ctx;
  let rule: Sinon.SinonSpy;
  let refineCb: sinon.SinonSpy<
    [value: string, _ctx: ctx],
    Valid<string> | InvalidRefined
  >;
  let util: Rule<string>;
  let result: Valid<string> | Invalid;

  beforeEach(function() {
    rule = sinon.spy((path, value, _ctx) => {
      if (typeof value === "undefined") {
        return {
          success: false,
          errors: [{
            value, name: "rule", path,
            code: "required",
            message: "Required"
          }]
        };
      } else {
        return {success: true, value};
      }
    });
    ctx = {};

    refineCb = sinon.fake(function (value: string, _ctx: ctx): Valid<string> | InvalidRefined {
      if (/\S+@\S+\.\S+/.test(value)) {
        return { success: true, value };
      } else {
        return {
          success: false,
          errors: [{
            code: "invalid_email",
            message: "Must be a valid email"
          }]
        };
      }
    });
    util = refine("email", rule, refineCb);
  });

  it("should return success when valid", function() {
    result = util([], "chunkylover53@aol.com", ctx) as Valid<string>;
    expect(result.success).to.be.true;
    expect(result.value).to.eq("chunkylover53@aol.com");
  });

  describe("initial rule", function() {

    it("should be called", function() {
      result = util([], "chunkylover53@aol.com", ctx);
      expect(rule.calledWithExactly([], "chunkylover53@aol.com", ctx)).to.be.true;
    });

    it("should return on error", function() {  
      result = util([], undefined, ctx) as Invalid;
      expect(result.errors.length).to.eq(1);
      expect(result.errors).to.eql([{
        value: undefined,
        name: "email", // Using custom name
        path: [],
        code: "required",
        message: "Required"
      }]);
    });

  });

  describe("custom rule", function() {

    it("should be called", function() {
      result = util([], "chunkylover53@aol.com", ctx);
      expect(refineCb.calledWithExactly("chunkylover53@aol.com", ctx)).to.be.true;
    });

    it("should return on error", function() {  
      result = util([], "not_an_email", ctx) as Invalid;
      expect(result.errors.length).to.eq(1);
      expect(result.errors).to.eql([{
        value: "not_an_email",
        name: "email", // Using custom name
        path: [],
        code: "invalid_email",
        message: "Must be a valid email"
      }]);
    });

  });

});
