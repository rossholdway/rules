import { expect } from "chai";
import sinon from "sinon";

import { coerce } from "../../src/utils/coerce";

describe("coerce", function() {

  it("should call callback with expected argument", function() {
    const coerceCb = sinon.fake.returns("742");
    const util = coerce(this.validRule, coerceCb);
    util([], 742, this.ctx);

    expect(coerceCb.calledWithExactly(742)).to.be.true;
  });

  it("should call rule with coerced value", function() {
    const coerceCb = sinon.fake.returns("742");
    const util = coerce(this.validRule, coerceCb);
    util([], 742, this.ctx);

    expect(this.validRule.calledWithExactly([], "742", this.ctx)).to.be.true;
  });

});
