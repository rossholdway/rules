import { expect } from "chai";
import sinon from "sinon";

import { ctx, Invalid, InvalidRefined, Valid } from "../../src";
import { refine } from "../../src/utils/refine";

describe("refine", function() {
  let refineCb: sinon.SinonSpy<
    [value: string, _ctx: ctx],
    Valid<string> | InvalidRefined
  >;
  let result: Valid<string> | Invalid;

  beforeEach(function() {
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
  });

  it("should return success when valid", function() {
    const util = refine("email", this.validRule, refineCb);
    result = util([], "chunkylover53@aol.com", this.ctx) as Valid<string>;
    expect(result.success).to.be.true;
    expect(result.value).to.eq("chunkylover53@aol.com");
  });

  describe("initial rule", function() {

    it("should be called", function() {
      const util = refine("email", this.validRule, refineCb);
      result = util([], "chunkylover53@aol.com", this.ctx);
      expect(this.validRule.calledOnceWithExactly([], "chunkylover53@aol.com", this.ctx)).to.be.true;
    });

    it("should return on error", function() {
      const util = refine("email", this.invalidRule, refineCb);
      result = util([], 742, this.ctx) as Invalid;
      expect(result.errors.length).to.eq(1);
      expect(result.errors).to.eql([{
        value: 742,
        name: "email", // Using custom name
        path: [],
        code: "error_code",
        message: "An error occured"
      }]);
    });

  });

  describe("custom rule", function() {

    it("should be called", function() {
      const util = refine("email", this.validRule, refineCb);
      result = util([], "chunkylover53@aol.com", this.ctx);
      expect(refineCb.calledOnceWithExactly("chunkylover53@aol.com", this.ctx)).to.be.true;
    });

    it("should return on error", function() {  
      const util = refine("email", this.validRule, refineCb);
      result = util([], "not_an_email", this.ctx) as Invalid;
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
