import { expect } from "chai";
import sinon from "sinon";

import { ctx, Invalid, Valid } from "../../src";
import { union } from "../../src/utils/union";
import Sinon from "sinon";

describe("union", function() {
  let ctx: ctx;
  let validRule: Sinon.SinonSpy;
  let invalidRule: Sinon.SinonSpy;

  beforeEach(function() {
    validRule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    invalidRule = sinon.spy((path, value, _ctx) => ({
      success: false,
      errors: [{
        value, name: "rule", path,
        code: "error_code",
        message: "An error occured"
      }]
    }));
    ctx = {};
  });

  it("should disallow undefined", function() {
    const util = union([validRule]);
    const result = util([], undefined, ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call each rule until valid", function() {
    const util = union([invalidRule, validRule, invalidRule]);
    util([], "Moe", ctx);

    expect(invalidRule.calledOnce).to.be.true;
    expect(validRule.calledOnce).to.be.true;
  });

  it("should return valid on first rule pass", function() {
    const util = union([validRule, validRule, validRule]);
    const result = util([], "Moe", ctx) as Valid<string>;

    expect(validRule.calledOnce).to.be.true;
    expect(result.success).to.be.true;
    expect(result.value).to.eq("Moe");
  });

  it("should return invalid if all rules fail", function() {
    const util = union([invalidRule, invalidRule, invalidRule]);
    const result = util([], "Homer", ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors.length).to.eq(3);
  });

  it("should return errors", function() {
    const util = union([invalidRule]);
    const result = util([], "Bart", ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors).to.eql([{
      value: "Bart",
      name: "rule",
      path: [],
      code: "error_code",
      message: "An error occured"
    }]);
  });

});
