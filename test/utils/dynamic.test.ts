import { expect } from "chai";
import sinon from "sinon";

import { ctx } from "../../src";
import { dynamic } from "../../src/utils/dynamic";
import Sinon from "sinon";

describe("dynamic", function() {
  let ctx: ctx;
  let rule: Sinon.SinonSpy;

  beforeEach(function() {
    rule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    ctx = {};
  });

  it("should provide the value and context to callback", function() {
    const dynamicCb = sinon.fake.returns(rule);
    const util = dynamic(dynamicCb);
    util([], "Homer", ctx);
    expect(dynamicCb.calledWithExactly("Homer", ctx)).to.be.true;
  });

  it("should call the rule returned by the callback", function() {
    const dynamicCb = sinon.fake.returns(rule);
    const util = dynamic(dynamicCb);
    util([], "Homer", ctx);
    expect(rule.calledWithExactly([], "Homer", ctx)).to.be.true;
  });

});
