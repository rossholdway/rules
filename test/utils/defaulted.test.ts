import { expect } from "chai";
import sinon from "sinon";

import { ctx } from "../../src";
import { defaulted } from "../../src/utils/defaulted";
import Sinon from "sinon";

describe("defaulted", function() {
  let ctx: ctx;
  let rule: Sinon.SinonSpy;

  beforeEach(function() {
    rule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    ctx = {};
  });

  it("should call callback when value is undefined", function() {
    const defaultedCb = sinon.fake();
    const util = defaulted(rule, defaultedCb);
    util([], undefined, ctx);
    expect(defaultedCb.calledWithExactly(ctx)).to.be.true;
  });

  it("should call rule with default value when undefined", function() {
    const defaultedCb = sinon.fake.returns("Max Power");
    const util = defaulted(rule, defaultedCb);
    util([], undefined, ctx);
    expect(rule.calledWithExactly([], "Max Power", ctx)).to.be.true;
  });

  it("should call rule with provided value when not undefined", function() {
    const defaultedCb = sinon.fake();
    const util = defaulted(rule, defaultedCb);
    util([], "Mr. Plow", ctx);
    expect(rule.calledWithExactly([], "Mr. Plow", ctx)).to.be.true;
  });

});
