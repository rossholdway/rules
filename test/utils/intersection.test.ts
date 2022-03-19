import { expect } from "chai";
import sinon from "sinon";

import { ctx, Valid, Invalid } from "../../src";
import { intersection } from "../../src/utils/intersection";
import Sinon from "sinon";

describe("intersection", function() {
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
    const util = intersection([validRule]);
    const result = util([], undefined, ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call every rule", function() {
    const util = intersection([validRule, invalidRule, validRule]);
    util([], "Bart", ctx);

    expect(validRule.calledTwice).to.be.true;
    expect(invalidRule.calledOnce).to.be.true;
  });

  it("should return valid if all rules pass", function() {
    const util = intersection([validRule, validRule, validRule]);
    const result = util([], "Bart", ctx) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("Bart");
  });

  it("should return invalid if any rule fails", function() {
    const util = intersection([validRule, validRule, invalidRule]);
    const result = util([], "Bart", ctx);

    expect(result.success).to.be.false;
  });

  it("should return errors", function() {
    const util = intersection([invalidRule]);
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
