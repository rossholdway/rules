import { expect } from "chai";
import sinon from "sinon";

import { defaulted } from "../../src/utils/defaulted";

describe("defaulted", function() {

  it("should call callback when value is undefined", function() {
    const defaultedCb = sinon.fake();
    const util = defaulted(this.validRule, defaultedCb);
    util([], undefined, this.ctx);

    expect(defaultedCb.calledWithExactly(this.ctx)).to.be.true;
  });

  it("should call rule with default value when undefined", function() {
    const defaultedCb = sinon.fake.returns("Max Power");
    const util = defaulted(this.validRule, defaultedCb);
    util([], undefined, this.ctx);

    expect(this.validRule.calledWithExactly([], "Max Power", this.ctx)).to.be.true;
  });

  it("should call rule with provided value when not undefined", function() {
    const defaultedCb = sinon.fake();
    const util = defaulted(this.validRule, defaultedCb);
    util([], "Mr. Plow", this.ctx);

    expect(this.validRule.calledWithExactly([], "Mr. Plow", this.ctx)).to.be.true;
  });

});
