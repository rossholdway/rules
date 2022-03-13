import { expect } from "chai";
import sinon from "sinon";

import { ctx } from "../../src";
import { coerce } from "../../src/utils/coerce";
import Sinon from "sinon";

describe("coerce", function() {
  let ctx: ctx;
  let rule: Sinon.SinonSpy;

  beforeEach(function() {
    rule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    ctx = {};
  });

  it("should call callback with expected argument", function() {
    const coerceCb = sinon.fake.returns("742");
    const util = coerce(rule, coerceCb);
    util([], 742, ctx);
    expect(coerceCb.calledWithExactly(742)).to.be.true;
  });

  it("should call rule with coerced value", function() {
    const coerceCb = sinon.fake.returns("742");
    const util = coerce(rule, coerceCb);
    util([], 742, ctx);
    expect(rule.calledWithExactly([], "742", ctx)).to.be.true;
  });

});
