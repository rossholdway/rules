import Sinon from "sinon";

import { dynamic } from "../../src/utils/dynamic";

describe("dynamic", function() {

  it("should provide the value and context to callback", function() {
    const dynamicCb = Sinon.fake.returns(this.validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", this.ctx);

    Sinon.assert.calledWithExactly(dynamicCb, "Homer", this.ctx);
  });

  it("should call the rule returned by the callback", function() {
    const dynamicCb = Sinon.fake.returns(this.validRule);
    const util = dynamic(dynamicCb);
    util([], "Homer", this.ctx);

    Sinon.assert.calledWithExactly(this.validRule, [], "Homer", this.ctx);
  });

});
