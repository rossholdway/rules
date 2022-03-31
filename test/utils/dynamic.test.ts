import { expect } from "chai";
import sinon from "sinon";

import { dynamic } from "../../src/utils/dynamic";

describe("dynamic", function() {

  it("should provide the value and context to callback", function() {
    const dynamicCb = sinon.fake.returns(this.validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", this.ctx);

    expect(dynamicCb.calledWithExactly("Homer", this.ctx)).to.be.true;
  });

  it("should call the rule returned by the callback", function() {
    const dynamicCb = sinon.fake.returns(this.validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", this.ctx);

    expect(this.validRule.calledWithExactly([], "Homer", this.ctx)).to.be.true;
  });

});
